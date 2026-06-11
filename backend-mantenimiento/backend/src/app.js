require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const activosRoutes = require('./routes/activos.routes');
const ordenesRoutes = require('./routes/ordenes.routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/activos', activosRoutes);
app.use('/api/ordenes', ordenesRoutes);

// Ruta de salud
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada.' });
});

// Manejo centralizado de errores (firma de 4 parámetros requerida por Express)
app.use(errorHandler);

module.exports = app;
