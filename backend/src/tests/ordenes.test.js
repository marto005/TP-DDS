process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_secret_jwt';

const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
const { Orden } = require('../models');
const { setupDB, teardownDB, crearUsuarios, crearActivos } = require('./helpers');

let usuarios, activos;
let tokenAdmin, tokenTecnico, tokenSolicitante, tokenMant;

const generarToken = (usuario) =>
  jwt.sign(
    { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

beforeAll(async () => {
  await setupDB();
  usuarios = await crearUsuarios();
  activos = await crearActivos();

  tokenAdmin = generarToken(usuarios.admin);
  tokenTecnico = generarToken(usuarios.tecnico);
  tokenSolicitante = generarToken(usuarios.solicitante);
  tokenMant = generarToken(usuarios.mant);
});

afterAll(async () => {
  await teardownDB();
});

// ─────────────────────────────────────────────────────────────────────────────
// Acceso sin JWT
// ─────────────────────────────────────────────────────────────────────────────
describe('Acceso sin JWT', () => {
  it('GET /api/ordenes sin token devuelve 401', async () => {
    const res = await request(app).get('/api/ordenes');
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error');
  });

  it('POST /api/ordenes sin token devuelve 401', async () => {
    const res = await request(app).post('/api/ordenes').send({});
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Listado de órdenes
// ─────────────────────────────────────────────────────────────────────────────
describe('GET /api/ordenes', () => {
  beforeAll(async () => {
    await Orden.create({
      activoId: activos.activoMedia.id,
      titulo: 'Orden de prueba listado',
      descripcion: 'Descripción de prueba',
      solicitanteId: usuarios.solicitante.id,
      prioridad: 'media',
      estado: 'abierta',
    });
  });

  it('lista órdenes con token válido', async () => {
    const res = await request(app)
      .get('/api/ordenes')
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('ordenes');
    expect(Array.isArray(res.body.ordenes)).toBe(true);
    expect(res.body).toHaveProperty('total');
  });

  it('lista órdenes con filtro por estado', async () => {
    const res = await request(app)
      .get('/api/ordenes?estado=abierta')
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect(res.status).toBe(200);
    res.body.ordenes.forEach((o) => expect(o.estado).toBe('abierta'));
  });

  it('lista órdenes con paginación', async () => {
    const res = await request(app)
      .get('/api/ordenes?page=1&limit=2')
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect(res.status).toBe(200);
    expect(res.body.ordenes.length).toBeLessThanOrEqual(2);
    expect(res.body).toHaveProperty('pagina', 1);
    expect(res.body).toHaveProperty('totalPaginas');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Detalle de orden
// ─────────────────────────────────────────────────────────────────────────────
describe('GET /api/ordenes/:id', () => {
  let ordenId;

  beforeAll(async () => {
    const o = await Orden.create({
      activoId: activos.activoMedia.id,
      titulo: 'Orden detalle test',
      descripcion: 'Para ver detalle',
      solicitanteId: usuarios.solicitante.id,
      prioridad: 'baja',
      estado: 'abierta',
    });
    ordenId = o.id;
  });

  it('devuelve el detalle de una orden existente', async () => {
    const res = await request(app)
      .get(`/api/ordenes/${ordenId}`)
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(ordenId);
    expect(res.body).toHaveProperty('activo');
  });

  it('devuelve 404 para orden inexistente', async () => {
    const res = await request(app)
      .get('/api/ordenes/99999')
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Creación de órdenes
// ─────────────────────────────────────────────────────────────────────────────
describe('POST /api/ordenes', () => {
  it('crea una orden válida correctamente', async () => {
    const res = await request(app)
      .post('/api/ordenes')
      .set('Authorization', `Bearer ${tokenSolicitante}`)
      .send({
        activoId: activos.activoMedia.id,
        titulo: 'Nueva orden',
        descripcion: 'Descripción detallada del problema',
        prioridad: 'media',
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.estado).toBe('abierta');
  });

  it('rechaza creación sobre activo en estado baja', async () => {
    const res = await request(app)
      .post('/api/ordenes')
      .set('Authorization', `Bearer ${tokenSolicitante}`)
      .send({
        activoId: activos.activoBaja.id,
        titulo: 'Orden sobre baja',
        descripcion: 'No debería crearse',
        prioridad: 'media',
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/baja/i);
  });

  it('rechaza prioridad baja para activo de criticidad alta', async () => {
    const res = await request(app)
      .post('/api/ordenes')
      .set('Authorization', `Bearer ${tokenSolicitante}`)
      .send({
        activoId: activos.activoAlta.id,
        titulo: 'Prioridad inválida',
        descripcion: 'Activo de criticidad alta con prioridad baja',
        prioridad: 'baja',
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/criticidad alta/i);
  });

  it('rechaza prioridad con valor inválido', async () => {
    const res = await request(app)
      .post('/api/ordenes')
      .set('Authorization', `Bearer ${tokenSolicitante}`)
      .send({
        activoId: activos.activoMedia.id,
        titulo: 'Orden prioridad rara',
        descripcion: 'Test',
        prioridad: 'critica',
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('rechaza creación de orden sobre activo inexistente', async () => {
    const res = await request(app)
      .post('/api/ordenes')
      .set('Authorization', `Bearer ${tokenSolicitante}`)
      .send({
        activoId: 99999,
        titulo: 'Activo inexistente',
        descripcion: 'No debería funcionar',
        prioridad: 'media',
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/inexistente/i);
  });

  it('solicitante con JWT de técnico no puede usar endpoint si no tiene permiso de escritura admin', async () => {
    // El técnico NO tiene permiso para crear órdenes según las rutas
    const res = await request(app)
      .post('/api/ordenes')
      .set('Authorization', `Bearer ${tokenTecnico}`)
      .send({
        activoId: activos.activoMedia.id,
        titulo: 'Orden de técnico',
        descripcion: 'Solo admin/mant/sol puede crear',
        prioridad: 'media',
      });

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty('error');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Resolución de órdenes
// ─────────────────────────────────────────────────────────────────────────────
describe('PATCH /api/ordenes/:id/resolver', () => {
  let ordenSinTecnico, ordenEnProceso, ordenCancelada;

  beforeAll(async () => {
    ordenSinTecnico = await Orden.create({
      activoId: activos.activoMedia.id,
      titulo: 'Sin técnico',
      descripcion: 'Para test resolución sin técnico',
      solicitanteId: usuarios.solicitante.id,
      prioridad: 'media',
      estado: 'en_proceso',
      // Sin tecnicoId
    });

    ordenEnProceso = await Orden.create({
      activoId: activos.activoMedia.id,
      titulo: 'En proceso con técnico',
      descripcion: 'Lista para resolver',
      solicitanteId: usuarios.solicitante.id,
      tecnicoId: usuarios.tecnico.id,
      prioridad: 'media',
      estado: 'en_proceso',
    });

    ordenCancelada = await Orden.create({
      activoId: activos.activoMedia.id,
      titulo: 'Cancelada',
      descripcion: 'No se puede resolver',
      solicitanteId: usuarios.solicitante.id,
      prioridad: 'media',
      estado: 'cancelada',
    });
  });

  it('rechaza resolver orden sin técnico asignado', async () => {
    const res = await request(app)
      .patch(`/api/ordenes/${ordenSinTecnico.id}/resolver`)
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/técnico/i);
  });

  it('resuelve correctamente una orden en_proceso con técnico', async () => {
    const res = await request(app)
      .patch(`/api/ordenes/${ordenEnProceso.id}/resolver`)
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect(res.status).toBe(200);
    expect(res.body.estado).toBe('resuelta');
    expect(res.body.fechaResolucion).not.toBeNull();
  });

  it('rechaza resolver una orden cancelada (transición inválida)', async () => {
    const res = await request(app)
      .patch(`/api/ordenes/${ordenCancelada.id}/resolver`)
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/cancelada/i);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Permisos
// ─────────────────────────────────────────────────────────────────────────────
describe('Autorización por rol', () => {
  it('solicitante no puede acceder al resumen (403)', async () => {
    const res = await request(app)
      .get('/api/ordenes/resumen')
      .set('Authorization', `Bearer ${tokenSolicitante}`);

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty('error');
  });

  it('técnico no puede acceder al resumen (403)', async () => {
    const res = await request(app)
      .get('/api/ordenes/resumen')
      .set('Authorization', `Bearer ${tokenTecnico}`);

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty('error');
  });

  it('admin puede acceder al resumen (200)', async () => {
    const res = await request(app)
      .get('/api/ordenes/resumen')
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('porEstado');
  });

  it('solicitante no puede asignar técnico a orden ajena (403)', async () => {
    const orden = await Orden.create({
      activoId: activos.activoMedia.id,
      titulo: 'Orden ajena',
      descripcion: 'Creada por admin',
      solicitanteId: usuarios.admin.id,
      prioridad: 'media',
      estado: 'abierta',
    });

    const res = await request(app)
      .patch(`/api/ordenes/${orden.id}/asignar`)
      .set('Authorization', `Bearer ${tokenSolicitante}`)
      .send({ tecnicoId: usuarios.tecnico.id });

    expect(res.status).toBe(403);
  });
});
