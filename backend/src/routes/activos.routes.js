const { Router } = require('express');
const { listar, detalle } = require('../controllers/activoController');
const autenticar = require('../middlewares/autenticar');

const router = Router();

router.get('/', autenticar, listar);
router.get('/:id', autenticar, detalle);

module.exports = router;
