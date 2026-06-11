const { Sequelize } = require('sequelize');
const path = require('path');

const isTest = process.env.NODE_ENV === 'test';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: isTest ? ':memory:' : (process.env.DB_PATH || path.join(__dirname, '../../database.sqlite')),
  logging: false,
});

module.exports = sequelize;
