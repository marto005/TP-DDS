require('dotenv').config();
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_secret_jwt';

const bcrypt = require('bcryptjs');
const { sequelize, Usuario, Activo, Orden } = require('../../models');

const setupDB = async () => {
  await sequelize.sync({ force: true });
};

const teardownDB = async () => {
  await sequelize.close();
};

const crearUsuarios = async () => {
  const hash = await bcrypt.hash('password123', 10);
  const admin = await Usuario.create({ nombre: 'Admin Test', email: 'admin@test.com', passwordHash: hash, rol: 'admin', activo: true });
  const mant = await Usuario.create({ nombre: 'Mant Test', email: 'mant@test.com', passwordHash: hash, rol: 'mantenimiento', activo: true });
  const tecnico = await Usuario.create({ nombre: 'Tec Test', email: 'tec@test.com', passwordHash: hash, rol: 'tecnico', activo: true });
  const solicitante = await Usuario.create({ nombre: 'Sol Test', email: 'sol@test.com', passwordHash: hash, rol: 'solicitante', activo: true });
  return { admin, mant, tecnico, solicitante };
};

const crearActivos = async () => {
  const activoAlta = await Activo.create({ codigo: 'TEST-ALTA-01', nombre: 'Activo Criticidad Alta', tipo: 'equipo', ubicacion: 'Aula 1', estado: 'operativo', criticidad: 'alta' });
  const activoMedia = await Activo.create({ codigo: 'TEST-MEDIA-01', nombre: 'Activo Criticidad Media', tipo: 'equipo', ubicacion: 'Aula 2', estado: 'operativo', criticidad: 'media' });
  const activoBaja = await Activo.create({ codigo: 'TEST-BAJA-01', nombre: 'Activo de Baja', tipo: 'equipo', ubicacion: 'Depósito', estado: 'baja', criticidad: 'baja' });
  return { activoAlta, activoMedia, activoBaja };
};

module.exports = { setupDB, teardownDB, crearUsuarios, crearActivos };
