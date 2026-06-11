const PRIORIDADES_VALIDAS = ['baja', 'media', 'alta', 'urgente'];
const ESTADOS_VALIDOS = ['abierta', 'asignada', 'en_proceso', 'resuelta', 'cancelada'];

const validarCrearOrden = (req, res, next) => {
  const { activoId, titulo, descripcion, prioridad } = req.body;
  const errores = [];

  if (!activoId) errores.push('activoId es requerido.');
  if (!titulo || titulo.trim() === '') errores.push('titulo es requerido.');
  if (!descripcion || descripcion.trim() === '') errores.push('descripcion es requerida.');
  if (!prioridad) errores.push('prioridad es requerida.');
  if (prioridad && !PRIORIDADES_VALIDAS.includes(prioridad)) {
    errores.push(`prioridad inválida. Valores permitidos: ${PRIORIDADES_VALIDAS.join(', ')}.`);
  }

  if (errores.length > 0) {
    return res.status(400).json({ error: errores.join(' ') });
  }
  next();
};

const validarEditarOrden = (req, res, next) => {
  const { prioridad, estado } = req.body;
  const errores = [];

  if (prioridad && !PRIORIDADES_VALIDAS.includes(prioridad)) {
    errores.push(`prioridad inválida. Valores permitidos: ${PRIORIDADES_VALIDAS.join(', ')}.`);
  }
  if (estado && !ESTADOS_VALIDOS.includes(estado)) {
    errores.push(`estado inválido. Valores permitidos: ${ESTADOS_VALIDOS.join(', ')}.`);
  }

  if (errores.length > 0) {
    return res.status(400).json({ error: errores.join(' ') });
  }
  next();
};

const validarRegistro = (req, res, next) => {
  const { nombre, email, password, rol } = req.body;
  const errores = [];
  const ROLES_VALIDOS = ['solicitante', 'tecnico', 'mantenimiento', 'admin'];

  if (!nombre || nombre.trim() === '') errores.push('nombre es requerido.');
  if (!email || email.trim() === '') errores.push('email es requerido.');
  if (!password || password.length < 6) errores.push('password debe tener al menos 6 caracteres.');
  if (rol && !ROLES_VALIDOS.includes(rol)) {
    errores.push(`rol inválido. Valores permitidos: ${ROLES_VALIDOS.join(', ')}.`);
  }

  if (errores.length > 0) {
    return res.status(400).json({ error: errores.join(' ') });
  }
  next();
};

module.exports = { validarCrearOrden, validarEditarOrden, validarRegistro };
