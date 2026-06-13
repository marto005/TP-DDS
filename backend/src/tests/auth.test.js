process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_secret_jwt';

const request = require('supertest');
const app = require('../app');
const { setupDB, teardownDB, crearUsuarios } = require('./helpers');

beforeAll(async () => {
  await setupDB();
  await crearUsuarios();
});

afterAll(async () => {
  await teardownDB();
});

describe('POST /api/auth/register', () => {
  it('registra un usuario nuevo correctamente', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ nombre: 'Nuevo Usuario', email: 'nuevo@test.com', password: 'password123', rol: 'solicitante' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('usuario');
    expect(res.body.usuario).not.toHaveProperty('passwordHash');
  });

  it('rechaza registro con email duplicado', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ nombre: 'Dup', email: 'admin@test.com', password: 'password123' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('rechaza registro sin password', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ nombre: 'Sin pass', email: 'sinpass@test.com' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});

describe('POST /api/auth/login', () => {
  it('login correcto devuelve token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@test.com', password: 'password123' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.usuario.rol).toBe('admin');
    expect(res.body.usuario).not.toHaveProperty('passwordHash');
  });

  it('login inválido con contraseña incorrecta devuelve 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@test.com', password: 'incorrecta' });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error');
  });

  it('login inválido con email inexistente devuelve 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'noexiste@test.com', password: 'password123' });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error');
  });
});
