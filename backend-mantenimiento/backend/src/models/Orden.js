const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Orden = sequelize.define('Orden', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  activoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  solicitanteId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  tecnicoId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  prioridad: {
    type: DataTypes.ENUM('baja', 'media', 'alta', 'urgente'),
    allowNull: false,
    defaultValue: 'media',
  },
  estado: {
    type: DataTypes.ENUM('abierta', 'asignada', 'en_proceso', 'resuelta', 'cancelada'),
    allowNull: false,
    defaultValue: 'abierta',
  },
  fechaCreacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  fechaResolucion: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'ordenes',
  timestamps: true,
});

module.exports = Orden;
