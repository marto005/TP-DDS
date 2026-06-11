const { Router } = require('express');
const autenticar = require('../middlewares/autenticar');
const autorizar = require('../middlewares/autorizar');
const ctrl = require('../controllers/usuarioController');

const router = Router();

router.use(autenticar);
router.get('/', autorizar('admin', 'mantenimiento'), ctrl.listar);

module.exports = router;