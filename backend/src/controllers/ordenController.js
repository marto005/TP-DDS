const ordenService = require('../services/ordenService');

const listar = async (req, res, next) => {
  try {
    const resultado = await ordenService.listarOrdenes(req.query, req.usuario);
    res.json(resultado);
  } catch (err) {
    next(err);
  }
};

const resumen = async (req, res, next) => {
  try {
    const datos = await ordenService.obtenerResumen();
    res.json(datos);
  } catch (err) {
    next(err);
  }
};

const detalle = async (req, res, next) => {
  try {
    const orden = await ordenService.obtenerOrdenVisible(req.params.id, req.usuario);
    res.json(orden);
  } catch (err) {
    next(err);
  }
};

const historial = async (req, res, next) => {
  try {
    const datos = await ordenService.obtenerHistorial(req.params.id, req.usuario);
    res.json(datos);
  } catch (err) {
    next(err);
  }
};

const crear = async (req, res, next) => {
  try {
    const orden = await ordenService.crearOrden(req.body, req.usuario.id);
    res.status(201).json(orden);
  } catch (err) {
    next(err);
  }
};

const editar = async (req, res, next) => {
  try {
    const orden = await ordenService.editarOrden(req.params.id, req.body, req.usuario);
    res.json(orden);
  } catch (err) {
    next(err);
  }
};

const cancelar = async (req, res, next) => {
  try {
    const orden = await ordenService.cancelarOrden(req.params.id, req.usuario);
    res.json(orden);
  } catch (err) {
    next(err);
  }
};

const asignar = async (req, res, next) => {
  try {
    const { tecnicoId } = req.body;
    if (!tecnicoId) return res.status(400).json({ error: 'tecnicoId es requerido.' });
    const orden = await ordenService.asignarTecnico(req.params.id, tecnicoId, req.usuario);
    res.json(orden);
  } catch (err) {
    next(err);
  }
};

const resolver = async (req, res, next) => {
  try {
    const orden = await ordenService.resolverOrden(req.params.id, req.usuario);
    res.json(orden);
  } catch (err) {
    next(err);
  }
};

module.exports = { listar, resumen, detalle, historial, crear, editar, cancelar, asignar, resolver };
