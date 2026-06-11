const usuarioService = require('../services/usuarioService');

const listar = async (req, res, next) => {
  try {
    const usuarios = await usuarioService.listarUsuarios();
    res.json(usuarios);
  } catch (err) {
    next(err);
  }
};

module.exports = { listar };