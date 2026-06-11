const { Usuario } = require('../models');

const listarUsuarios = async () => {
  const usuarios = await Usuario.findAll({
    attributes: ['id', 'nombre', 'email', 'rol', 'activo'],
    order: [['id', 'ASC']],
  });

  return usuarios;
};

module.exports = { listarUsuarios };