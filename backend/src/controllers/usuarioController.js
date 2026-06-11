const { Usuario } = require('../models');

const listarTecnicos = async (req, res, next) => {
  try {
    const tecnicos = await Usuario.findAll({
      where: { rol: 'tecnico', activo: true },
      attributes: ['id', 'nombre', 'email', 'rol'],
      order: [['nombre', 'ASC']],
    });
    res.json(tecnicos);
  } catch (err) {
    next(err);
  }
};

const listar = async (req, res, next) => {
  try {
    const { rol } = req.query;
    const where = { activo: true };
    if (rol) where.rol = rol;

    const usuarios = await Usuario.findAll({
      where,
      attributes: ['id', 'nombre', 'email', 'rol', 'activo'],
      order: [['nombre', 'ASC']],
    });
    res.json(usuarios);
  } catch (err) {
    next(err);
  }
};

module.exports = { listar, listarTecnicos };
