const { Router } = require('express');
const { listar, listarTecnicos } = require('../controllers/usuarioController');
const autenticar = require('../middlewares/autenticar');

const router = Router();

// Todas las rutas requieren autenticación
router.use(autenticar);

// GET /api/usuarios?rol=tecnico
router.get('/', listar);

// GET /api/usuarios/tecnicos  (shortcut)
router.get('/tecnicos', listarTecnicos);

module.exports = router;
