const { Op } = require('sequelize');
const { Orden, Activo, Usuario, HistorialOrden } = require('../models');

const AppError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// ─── Helpers ────────────────────────────────────────────────────────────────

const TRANSICIONES_VALIDAS = {
  abierta: ['asignada', 'cancelada'],
  asignada: ['en_proceso', 'cancelada'],
  en_proceso: ['resuelta', 'cancelada'],
  resuelta: [],
  cancelada: [],
};

const registrarHistorial = async (ordenId, usuarioId, accion, valorAnterior, valorNuevo) => {
  await HistorialOrden.create({
    ordenId,
    usuarioId,
    accion,
    fechaHora: new Date(),
    valorAnterior: valorAnterior || null,
    valorNuevo: valorNuevo || null,
  });
};

// ─── Servicio ────────────────────────────────────────────────────────────────

const puedeVerOrden = (usuario, orden) => {
  if (!usuario || !orden) return false;
  if (['admin', 'mantenimiento'].includes(usuario.rol)) return true;
  if (usuario.rol === 'solicitante') return orden.solicitanteId === usuario.id;
  if (usuario.rol === 'tecnico') return orden.tecnicoId === usuario.id;
  return false;
};

const listarOrdenes = async (filtros, usuario) => {
  const { activoId, estado, prioridad, tecnicoId, page, limit, sortBy, order } = filtros;
  const where = {};
  if (activoId) where.activoId = activoId;
  if (estado) where.estado = estado;
  if (prioridad) where.prioridad = prioridad;
  if (tecnicoId) where.tecnicoId = tecnicoId;

  if (usuario?.rol === 'solicitante') {
    where.solicitanteId = usuario.id;
  } else if (usuario?.rol === 'tecnico') {
    where.tecnicoId = usuario.id;
  }

  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
  const offset = (pageNum - 1) * limitNum;

  const camposOrdenables = ['id', 'fechaCreacion', 'prioridad', 'estado'];
  const sortField = camposOrdenables.includes(sortBy) ? sortBy : 'fechaCreacion';
  const sortOrder = order === 'asc' ? 'ASC' : 'DESC';

  const { count, rows } = await Orden.findAndCountAll({
    where,
    include: [
      { model: Activo, as: 'activo', attributes: ['id', 'codigo', 'nombre', 'criticidad', 'estado'] },
      { model: Usuario, as: 'solicitante', attributes: ['id', 'nombre', 'email'] },
      { model: Usuario, as: 'tecnico', attributes: ['id', 'nombre', 'email'] },
    ],
    order: [[sortField, sortOrder]],
    limit: limitNum,
    offset,
  });

  return {
    total: count,
    pagina: pageNum,
    totalPaginas: Math.ceil(count / limitNum),
    ordenes: rows,
  };
};

const obtenerOrden = async (id) => {
  const orden = await Orden.findByPk(id, {
    include: [
      { model: Activo, as: 'activo' },
      { model: Usuario, as: 'solicitante', attributes: ['id', 'nombre', 'email', 'rol'] },
      { model: Usuario, as: 'tecnico', attributes: ['id', 'nombre', 'email', 'rol'] },
    ],
  });
  if (!orden) throw AppError('Orden no encontrada.', 404);
  return orden;
};

const obtenerOrdenVisible = async (id, usuario) => {
  const orden = await obtenerOrden(id);
  if (!puedeVerOrden(usuario, orden)) {
    throw AppError('No tenés permiso para ver esta orden.', 403);
  }
  return orden;
};

const obtenerHistorial = async (ordenId, usuario) => {
  const orden = await obtenerOrdenVisible(ordenId, usuario);

  return HistorialOrden.findAll({
    where: { ordenId },
    include: [{ model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'rol'] }],
    order: [['fechaHora', 'ASC']],
  });
};

const crearOrden = async (datos, usuarioId) => {
  const { activoId, titulo, descripcion, prioridad, tecnicoId } = datos;

  // Regla: el activo debe existir y no estar en baja
  const activo = await Activo.findByPk(activoId);
  if (!activo) throw AppError('Activo inexistente. No se puede crear la orden.', 400);
  if (activo.estado === 'baja') {
    throw AppError('No se puede crear una orden sobre un activo dado de baja.', 400);
  }

  // Regla: criticidad alta → prioridad no puede ser baja
  if (activo.criticidad === 'alta' && prioridad === 'baja') {
    throw AppError('Un activo de criticidad alta no puede tener una orden con prioridad baja.', 400);
  }

  // Si se indica técnico, verificar que exista y tenga rol técnico
  if (tecnicoId) {
    const tecnico = await Usuario.findByPk(tecnicoId);
    if (!tecnico || tecnico.rol !== 'tecnico') {
      throw AppError('El técnico asignado no existe o no tiene rol de técnico.', 400);
    }
  }

  const orden = await Orden.create({
    activoId,
    titulo,
    descripcion,
    prioridad,
    tecnicoId: tecnicoId || null,
    solicitanteId: usuarioId,
    estado: tecnicoId ? 'asignada' : 'abierta',
    fechaCreacion: new Date(),
  });

  // Cambio de estado del activo
  if (activo.estado === 'operativo') {
    await activo.update({ estado: 'con_falla' });
  }

  await registrarHistorial(orden.id, usuarioId, 'creacion', null, {
    estado: orden.estado,
    prioridad: orden.prioridad,
  });

  return obtenerOrden(orden.id);
};

const editarOrden = async (id, datos, usuarioActual) => {
  const orden = await Orden.findByPk(id);
  if (!orden) throw AppError('Orden no encontrada.', 404);

  if (orden.estado === 'resuelta' || orden.estado === 'cancelada') {
    throw AppError(`No se puede editar una orden en estado ${orden.estado}.`, 400);
  }

  // Permisos: solicitante solo puede editar sus propias órdenes abiertas
  const esAdminOMant = ['admin', 'mantenimiento'].includes(usuarioActual.rol);
  if (!esAdminOMant && orden.solicitanteId !== usuarioActual.id) {
    throw AppError('No tenés permiso para editar esta orden.', 403);
  }

  const { titulo, descripcion, prioridad, tecnicoId, estado } = datos;
  const anteriorSnapshot = {
    titulo: orden.titulo,
    descripcion: orden.descripcion,
    prioridad: orden.prioridad,
    tecnicoId: orden.tecnicoId,
    estado: orden.estado,
  };

  // Validar prioridad contra criticidad del activo
  if (prioridad) {
    const activo = await Activo.findByPk(orden.activoId);
    if (activo.criticidad === 'alta' && prioridad === 'baja') {
      throw AppError('Un activo de criticidad alta no puede tener prioridad baja.', 400);
    }
  }

  // Validar transición de estado si se cambia
  if (estado && estado !== orden.estado) {
    const transicionesPermitidas = TRANSICIONES_VALIDAS[orden.estado] || [];
    if (!transicionesPermitidas.includes(estado)) {
      throw AppError(
        `Transición de estado inválida: ${orden.estado} → ${estado}. Transiciones permitidas: ${transicionesPermitidas.join(', ') || 'ninguna'}.`,
        400
      );
    }
  }

  // Si se asigna técnico, verificar rol
  if (tecnicoId !== undefined && tecnicoId !== null) {
    const tecnico = await Usuario.findByPk(tecnicoId);
    if (!tecnico || tecnico.rol !== 'tecnico') {
      throw AppError('El técnico asignado no existe o no tiene rol de técnico.', 400);
    }
  }

  const actualizacion = {};
  if (titulo !== undefined) actualizacion.titulo = titulo;
  if (descripcion !== undefined) actualizacion.descripcion = descripcion;
  if (prioridad !== undefined) actualizacion.prioridad = prioridad;
  if (tecnicoId !== undefined) {
    actualizacion.tecnicoId = tecnicoId;
    if (orden.estado === 'abierta') actualizacion.estado = 'asignada';
  }
  if (estado !== undefined) actualizacion.estado = estado;

  await orden.update(actualizacion);

  await registrarHistorial(orden.id, usuarioActual.id, 'edicion', anteriorSnapshot, actualizacion);

  return obtenerOrden(id);
};

const cancelarOrden = async (id, usuarioActual) => {
  const orden = await Orden.findByPk(id);
  if (!orden) throw AppError('Orden no encontrada.', 404);

  if (orden.estado === 'resuelta') {
    throw AppError('No se puede cancelar una orden ya resuelta.', 400);
  }
  if (orden.estado === 'cancelada') {
    throw AppError('La orden ya está cancelada.', 400);
  }

  const esAdminOMant = ['admin', 'mantenimiento'].includes(usuarioActual.rol);
  const esSolicitantePropietario =
    usuarioActual.rol === 'solicitante' &&
    orden.solicitanteId === usuarioActual.id &&
    orden.estado === 'abierta';

  if (!esAdminOMant && !esSolicitantePropietario) {
    throw AppError('No tenés permiso para cancelar esta orden.', 403);
  }

  const estadoAnterior = orden.estado;
  await orden.update({ estado: 'cancelada' });

  await registrarHistorial(orden.id, usuarioActual.id, 'cancelacion',
    { estado: estadoAnterior }, { estado: 'cancelada' });

  return obtenerOrden(id);
};

const asignarTecnico = async (id, tecnicoId, usuarioActual) => {
  const orden = await Orden.findByPk(id);
  if (!orden) throw AppError('Orden no encontrada.', 404);

  if (!['abierta', 'asignada'].includes(orden.estado)) {
    throw AppError(`No se puede asignar técnico a una orden en estado ${orden.estado}.`, 400);
  }

  const tecnico = await Usuario.findByPk(tecnicoId);
  if (!tecnico || tecnico.rol !== 'tecnico') {
    throw AppError('El técnico no existe o no tiene rol de técnico.', 400);
  }

  const anteriorTecnicoId = orden.tecnicoId;
  await orden.update({ tecnicoId, estado: 'asignada' });

  // Cambio de estado del activo
  const activo = await Activo.findByPk(orden.activoId);
  if (activo && activo.estado === 'con_falla') {
    await activo.update({ estado: 'en_mantenimiento' });
  }

  await registrarHistorial(orden.id, usuarioActual.id, 'asignacion',
    { tecnicoId: anteriorTecnicoId, estado: 'abierta' },
    { tecnicoId, estado: 'asignada' });

  return obtenerOrden(id);
};

const resolverOrden = async (id, usuarioActual) => {
  const orden = await Orden.findByPk(id);
  if (!orden) throw AppError('Orden no encontrada.', 404);

  if (orden.estado === 'cancelada') {
    throw AppError('No se puede resolver una orden cancelada.', 400);
  }
  if (orden.estado === 'resuelta') {
    throw AppError('La orden ya está resuelta.', 400);
  }
  if (orden.estado !== 'en_proceso') {
    throw AppError(`Solo se pueden resolver órdenes en estado en_proceso. Estado actual: ${orden.estado}.`, 400);
  }
  if (!orden.tecnicoId) {
    throw AppError('No se puede resolver una orden sin técnico asignado.', 400);
  }

  // Solo el técnico asignado o admin/mantenimiento pueden resolver
  const esAdminOMant = ['admin', 'mantenimiento'].includes(usuarioActual.rol);
  const esTecnicoAsignado = usuarioActual.rol === 'tecnico' && orden.tecnicoId === usuarioActual.id;
  if (!esAdminOMant && !esTecnicoAsignado) {
    throw AppError('Solo el técnico asignado puede resolver esta orden.', 403);
  }

  const estadoAnterior = orden.estado;
  await orden.update({ estado: 'resuelta', fechaResolucion: new Date() });

  // Cambio de estado del activo
  const activo = await Activo.findByPk(orden.activoId);
  if (activo && activo.estado === 'en_mantenimiento') {
    const otrasOrdenesPendientes = await Orden.count({
      where: {
        activoId: activo.id,
        estado: { [Op.in]: ['abierta', 'asignada', 'en_proceso'] },
        id: { [Op.ne]: id },
      },
    });
    if (otrasOrdenesPendientes === 0) {
      await activo.update({ estado: 'operativo' });
    }
  }

  await registrarHistorial(orden.id, usuarioActual.id, 'resolucion',
    { estado: estadoAnterior }, { estado: 'resuelta', fechaResolucion: orden.fechaResolucion });

  return obtenerOrden(id);
};

const obtenerResumen = async () => {
  const [porEstado, urgentes, sinTecnico, activosConFallas] = await Promise.all([
    // Órdenes agrupadas por estado
    Orden.findAll({
      attributes: ['estado', [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'total']],
      group: ['estado'],
      raw: true,
    }),
    // Órdenes urgentes pendientes
    Orden.count({ where: { prioridad: 'urgente', estado: { [Op.notIn]: ['resuelta', 'cancelada'] } } }),
    // Órdenes sin técnico
    Orden.count({ where: { tecnicoId: null, estado: { [Op.notIn]: ['resuelta', 'cancelada'] } } }),
    // Activos con más fallas (órdenes)
    Orden.findAll({
      attributes: ['activoId', [require('sequelize').fn('COUNT', require('sequelize').col('Orden.id')), 'totalOrdenes']],
      include: [{ model: Activo, as: 'activo', attributes: ['id', 'codigo', 'nombre'] }],
      group: ['activoId'],
      order: [[require('sequelize').fn('COUNT', require('sequelize').col('Orden.id')), 'DESC']],
      limit: 5,
    }),
  ]);

  return { porEstado, urgentes, sinTecnico, activosConFallas };
};

module.exports = {
  listarOrdenes,
  obtenerOrden,
  obtenerOrdenVisible,
  obtenerHistorial,
  crearOrden,
  editarOrden,
  cancelarOrden,
  asignarTecnico,
  resolverOrden,
  obtenerResumen,
};
