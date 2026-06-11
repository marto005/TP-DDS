const { Activo } = require('../models');

const listar = async (req, res, next) => {
  try {
    const { estado, criticidad } = req.query;
    const where = {};
    if (estado) where.estado = estado;
    if (criticidad) where.criticidad = criticidad;

    const activos = await Activo.findAll({ where, order: [['nombre', 'ASC']] });
    res.json(activos);
  } catch (err) {
    next(err);
  }
};

const detalle = async (req, res, next) => {
  try {
    const activo = await Activo.findByPk(req.params.id);
    if (!activo) return res.status(404).json({ error: 'Activo no encontrado.' });
    res.json(activo);
  } catch (err) {
    next(err);
  }
};

module.exports = { listar, detalle };
