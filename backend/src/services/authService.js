const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

const AppError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

const registrar = async ({ nombre, email, password, rol }) => {
  const existe = await Usuario.findOne({ where: { email } });
  if (existe) throw AppError('Ya existe un usuario con ese email.', 400);

  const passwordHash = await bcrypt.hash(password, 10);
  const usuario = await Usuario.create({
    nombre,
    email,
    passwordHash,
    rol: rol || 'solicitante',
  });

  const { passwordHash: _, ...datos } = usuario.toJSON();
  return datos;
};

const login = async ({ email, password }) => {
  if (!email || !password) throw AppError('Email y password son requeridos.', 400);

  const usuario = await Usuario.findOne({ where: { email } });
  if (!usuario) throw AppError('Credenciales inválidas.', 401);
  if (!usuario.activo) throw AppError('Usuario desactivado. Contacte al administrador.', 403);

  const passwordValida = await bcrypt.compare(password, usuario.passwordHash);
  if (!passwordValida) throw AppError('Credenciales inválidas.', 401);

  const payload = {
    id: usuario.id,
    nombre: usuario.nombre,
    email: usuario.email,
    rol: usuario.rol,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  });

  return { token, usuario: payload };
};

module.exports = { registrar, login };
