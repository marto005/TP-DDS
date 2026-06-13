const { Router } = require('express');
const { registrar, login } = require('../controllers/authController');
const { validarRegistro } = require('../middlewares/validaciones');

const router = Router();

router.post('/register', validarRegistro, registrar);
router.post('/login', login);

module.exports = router;
