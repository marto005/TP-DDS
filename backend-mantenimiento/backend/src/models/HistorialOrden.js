const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const HistorialOrden = sequelize.define('HistorialOrden', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  ordenId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  accion: {
    type: DataTypes.ENUM(
      'creacion',
      'asignacion',
      'cambio_prioridad',
      'cambio_estado',
      'resolucion',
      'cancelacion',
      'edicion'
    ),
    allowNull: false,
  },
  fechaHora: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  valorAnterior: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const raw = this.getDataValue('valorAnterior');
      return raw ? JSON.parse(raw) : null;
    },
    set(value) {
      this.setDataValue('valorAnterior', value ? JSON.stringify(value) : null);
    },
  },
  valorNuevo: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const raw = this.getDataValue('valorNuevo');
      return raw ? JSON.parse(raw) : null;
    },
    set(value) {
      this.setDataValue('valorNuevo', value ? JSON.stringify(value) : null);
    },
  },
}, {
  tableName: 'historial_ordenes',
  timestamps: false,
});

module.exports = HistorialOrden;
