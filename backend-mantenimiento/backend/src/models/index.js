const sequelize = require('../config/database');
const Usuario = require('./Usuario');
const Activo = require('./Activo');
const Orden = require('./Orden');
const HistorialOrden = require('./HistorialOrden');

// Orden <-> Activo
Activo.hasMany(Orden, { foreignKey: 'activoId', as: 'ordenes' });
Orden.belongsTo(Activo, { foreignKey: 'activoId', as: 'activo' });

// Orden <-> Usuario (solicitante)
Usuario.hasMany(Orden, { foreignKey: 'solicitanteId', as: 'ordenesCreadas' });
Orden.belongsTo(Usuario, { foreignKey: 'solicitanteId', as: 'solicitante' });

// Orden <-> Usuario (tecnico)
Usuario.hasMany(Orden, { foreignKey: 'tecnicoId', as: 'ordenesAsignadas' });
Orden.belongsTo(Usuario, { foreignKey: 'tecnicoId', as: 'tecnico' });

// HistorialOrden <-> Orden
Orden.hasMany(HistorialOrden, { foreignKey: 'ordenId', as: 'historial' });
HistorialOrden.belongsTo(Orden, { foreignKey: 'ordenId', as: 'orden' });

// HistorialOrden <-> Usuario
Usuario.hasMany(HistorialOrden, { foreignKey: 'usuarioId', as: 'historialAcciones' });
HistorialOrden.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });

module.exports = { sequelize, Usuario, Activo, Orden, HistorialOrden };
