const { Router } = require('express');
const ctrl = require('../controllers/ordenController');
const autenticar = require('../middlewares/autenticar');
const autorizar = require('../middlewares/autorizar');
const { validarCrearOrden, validarEditarOrden } = require('../middlewares/validaciones');

const router = Router();

// Todas las rutas requieren autenticación
router.use(autenticar);

// Resumen administrativo (ANTES de /:id para no ser capturado como param)
router.get('/resumen',
  autorizar('admin', 'mantenimiento'),
  ctrl.resumen
);

// Listado con filtros y paginación
router.get('/', ctrl.listar);

// Detalle de orden
router.get('/:id', ctrl.detalle);

// Historial de orden
router.get('/:id/historial', ctrl.historial);

// Crear orden
router.post('/',
  autorizar('solicitante', 'mantenimiento', 'admin'),
  validarCrearOrden,
  ctrl.crear
);

// Editar orden
router.put('/:id',
  validarEditarOrden,
  ctrl.editar
);

// Cancelar orden
router.patch('/:id/cancelar', ctrl.cancelar);

// Asignar técnico
router.patch('/:id/asignar',
  autorizar('admin', 'mantenimiento'),
  ctrl.asignar
);

// Resolver orden
router.patch('/:id/resolver',
  autorizar('tecnico', 'admin', 'mantenimiento'),
  ctrl.resolver
);

module.exports = router;
