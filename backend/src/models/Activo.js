const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Activo = sequelize.define('Activo', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  codigo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tipo: {
    type: DataTypes.ENUM('equipo', 'instalacion', 'mobiliario', 'software'),
    allowNull: false,
  },
  ubicacion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  estado: {
    type: DataTypes.ENUM('operativo', 'con_falla', 'en_mantenimiento', 'baja'),
    allowNull: false,
    defaultValue: 'operativo',
  },
  criticidad: {
    type: DataTypes.ENUM('baja', 'media', 'alta'),
    allowNull: false,
    defaultValue: 'media',
  },
}, {
  tableName: 'activos',
  timestamps: true,
});

module.exports = Activo;
