require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, Usuario, Activo, Orden, HistorialOrden } = require('../models');

const seed = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
    console.log('🗑️  Base de datos reiniciada.');

    // ─── Usuarios ──────────────────────────────────────────────────
    const hash = await bcrypt.hash('password123', 10);

    const [admin, mant, tec1, tec2, tec3, sol1, sol2] = await Usuario.bulkCreate([
      { nombre: 'Admin Sistema', email: 'admin@dds.com', passwordHash: hash, rol: 'admin', activo: true },
      { nombre: 'Carlos Mantenimiento', email: 'mantenimiento@dds.com', passwordHash: hash, rol: 'mantenimiento', activo: true },
      { nombre: 'Lucas Técnico', email: 'tecnico1@dds.com', passwordHash: hash, rol: 'tecnico', activo: true },
      { nombre: 'Sofía Técnica', email: 'tecnico2@dds.com', passwordHash: hash, rol: 'tecnico', activo: true },
      { nombre: 'Marcos Técnico', email: 'tecnico3@dds.com', passwordHash: hash, rol: 'tecnico', activo: true },
      { nombre: 'Ana Solicitante', email: 'ana@dds.com', passwordHash: hash, rol: 'solicitante', activo: true },
      { nombre: 'Bruno Solicitante', email: 'bruno@dds.com', passwordHash: hash, rol: 'solicitante', activo: true },
    ]);

    console.log('✅ Usuarios creados.');

    // ─── Activos ───────────────────────────────────────────────────
    const [a1, a2, a3, a4, a5, a6, a7, a8] = await Activo.bulkCreate([
      { codigo: 'AIRE-2P-03', nombre: 'Aire acondicionado Aula 3', tipo: 'equipo', ubicacion: 'Ed. Possetto - Aula 3', estado: 'operativo', criticidad: 'alta' },
      { codigo: 'PROY-1P-01', nombre: 'Proyector Aula 1', tipo: 'equipo', ubicacion: 'Ed. Possetto - Aula 1', estado: 'con_falla', criticidad: 'alta' },
      { codigo: 'SERV-DC-01', nombre: 'Servidor Principal DC', tipo: 'equipo', ubicacion: 'Data Center', estado: 'operativo', criticidad: 'alta' },
      { codigo: 'INST-ELEC-02', nombre: 'Instalación Eléctrica PB', tipo: 'instalacion', ubicacion: 'Planta Baja', estado: 'en_mantenimiento', criticidad: 'alta' },
      { codigo: 'PROY-2P-04', nombre: 'Proyector Sala Conferencias', tipo: 'equipo', ubicacion: 'Ed. Central - Sala A', estado: 'operativo', criticidad: 'media' },
      { codigo: 'MOB-OF-03', nombre: 'Sillas Dirección', tipo: 'mobiliario', ubicacion: 'Dirección', estado: 'operativo', criticidad: 'baja' },
      { codigo: 'SW-ERP-01', nombre: 'Sistema ERP', tipo: 'software', ubicacion: 'Servidor Virtual', estado: 'operativo', criticidad: 'alta' },
      { codigo: 'AIRE-1P-07', nombre: 'Aire acondicionado Pasillo 7', tipo: 'equipo', ubicacion: 'Ed. Central - Piso 1', estado: 'baja', criticidad: 'baja' },
    ]);

    console.log('✅ Activos creados.');

    // ─── Órdenes ───────────────────────────────────────────────────
    const ordenes = await Orden.bulkCreate([
      // Orden 1: abierta
      { activoId: a1.id, titulo: 'No enfría', descripcion: 'El equipo enciende pero no baja temperatura', solicitanteId: sol1.id, prioridad: 'alta', estado: 'abierta', fechaCreacion: new Date('2026-06-01T09:00:00') },
      // Orden 2: asignada
      { activoId: a2.id, titulo: 'No proyecta imagen', descripcion: 'La imagen se corta cada 5 minutos', solicitanteId: sol1.id, tecnicoId: tec1.id, prioridad: 'urgente', estado: 'asignada', fechaCreacion: new Date('2026-06-02T10:00:00') },
      // Orden 3: en_proceso
      { activoId: a3.id, titulo: 'Lentitud en servidor', descripcion: 'El servidor principal responde lento durante el día', solicitanteId: admin.id, tecnicoId: tec2.id, prioridad: 'alta', estado: 'en_proceso', fechaCreacion: new Date('2026-06-03T08:00:00') },
      // Orden 4: resuelta
      { activoId: a5.id, titulo: 'Cable HDMI suelto', descripcion: 'El cable se desconecta solo', solicitanteId: sol2.id, tecnicoId: tec1.id, prioridad: 'media', estado: 'resuelta', fechaCreacion: new Date('2026-05-28T14:00:00'), fechaResolucion: new Date('2026-05-29T11:00:00') },
      // Orden 5: cancelada
      { activoId: a6.id, titulo: 'Silla rota', descripcion: 'Una pata se desprendió', solicitanteId: sol2.id, prioridad: 'baja', estado: 'cancelada', fechaCreacion: new Date('2026-05-25T09:00:00') },
      // Orden 6: abierta alta criticidad
      { activoId: a7.id, titulo: 'ERP no carga módulo de compras', descripcion: 'El módulo de compras da error 500 desde ayer', solicitanteId: sol1.id, prioridad: 'urgente', estado: 'abierta', fechaCreacion: new Date('2026-06-04T07:30:00') },
      // Orden 7: asignada
      { activoId: a4.id, titulo: 'Corte de luz parcial', descripcion: 'Varios tomacorrientes de PB no tienen tensión', solicitanteId: mant.id, tecnicoId: tec3.id, prioridad: 'urgente', estado: 'asignada', fechaCreacion: new Date('2026-06-05T08:00:00') },
      // Orden 8: en_proceso
      { activoId: a1.id, titulo: 'Ruido excesivo del compresor', descripcion: 'El compresor hace ruido metálico al arrancar', solicitanteId: sol1.id, tecnicoId: tec2.id, prioridad: 'media', estado: 'en_proceso', fechaCreacion: new Date('2026-06-05T10:00:00') },
      // Orden 9: abierta
      { activoId: a3.id, titulo: 'Disco casi lleno', descripcion: 'El disco del servidor está al 90% de capacidad', solicitanteId: admin.id, prioridad: 'alta', estado: 'abierta', fechaCreacion: new Date('2026-06-06T09:00:00') },
      // Orden 10: resuelta
      { activoId: a5.id, titulo: 'Lámpara del proyector agotada', descripcion: 'La imagen es muy tenue', solicitanteId: sol2.id, tecnicoId: tec1.id, prioridad: 'media', estado: 'resuelta', fechaCreacion: new Date('2026-05-20T11:00:00'), fechaResolucion: new Date('2026-05-22T16:00:00') },
      // Orden 11: abierta urgente
      { activoId: a7.id, titulo: 'ERP caído completamente', descripcion: 'El sistema ERP no responde desde las 8am', solicitanteId: mant.id, prioridad: 'urgente', estado: 'abierta', fechaCreacion: new Date('2026-06-07T08:15:00') },
      // Orden 12: asignada
      { activoId: a2.id, titulo: 'Proyector no enciende', descripcion: 'No enciende ni en modo stand-by', solicitanteId: sol1.id, tecnicoId: tec3.id, prioridad: 'alta', estado: 'asignada', fechaCreacion: new Date('2026-06-07T09:00:00') },
      // Orden 13: cancelada
      { activoId: a3.id, titulo: 'Solicitud duplicada', descripcion: 'Se crea por error, ya está cubierta por orden 3', solicitanteId: sol2.id, prioridad: 'media', estado: 'cancelada', fechaCreacion: new Date('2026-06-07T10:00:00') },
      // Orden 14: en_proceso
      { activoId: a4.id, titulo: 'Tablero eléctrico recalentado', descripcion: 'El tablero principal tiene temperatura elevada', solicitanteId: mant.id, tecnicoId: tec3.id, prioridad: 'urgente', estado: 'en_proceso', fechaCreacion: new Date('2026-06-08T07:00:00') },
      // Orden 15: abierta
      { activoId: a1.id, titulo: 'Control remoto perdido', descripcion: 'No se encuentra el control del aire del aula 3', solicitanteId: sol2.id, prioridad: 'media', estado: 'abierta', fechaCreacion: new Date('2026-06-09T08:00:00') },
    ]);

    console.log('✅ 15 Órdenes creadas.');

    // ─── Historial para algunas órdenes ────────────────────────────
    await HistorialOrden.bulkCreate([
      { ordenId: ordenes[0].id, usuarioId: sol1.id, accion: 'creacion', fechaHora: new Date('2026-06-01T09:00:00'), valorNuevo: JSON.stringify({ estado: 'abierta', prioridad: 'alta' }) },
      { ordenId: ordenes[1].id, usuarioId: sol1.id, accion: 'creacion', fechaHora: new Date('2026-06-02T10:00:00'), valorNuevo: JSON.stringify({ estado: 'abierta' }) },
      { ordenId: ordenes[1].id, usuarioId: admin.id, accion: 'asignacion', fechaHora: new Date('2026-06-02T11:00:00'), valorAnterior: JSON.stringify({ tecnicoId: null }), valorNuevo: JSON.stringify({ tecnicoId: tec1.id, estado: 'asignada' }) },
      { ordenId: ordenes[2].id, usuarioId: sol1.id, accion: 'creacion', fechaHora: new Date('2026-06-03T08:00:00'), valorNuevo: JSON.stringify({ estado: 'abierta' }) },
      { ordenId: ordenes[2].id, usuarioId: admin.id, accion: 'asignacion', fechaHora: new Date('2026-06-03T09:00:00'), valorAnterior: JSON.stringify({ estado: 'abierta' }), valorNuevo: JSON.stringify({ estado: 'asignada' }) },
      { ordenId: ordenes[2].id, usuarioId: tec2.id, accion: 'cambio_estado', fechaHora: new Date('2026-06-03T10:00:00'), valorAnterior: JSON.stringify({ estado: 'asignada' }), valorNuevo: JSON.stringify({ estado: 'en_proceso' }) },
      { ordenId: ordenes[3].id, usuarioId: sol2.id, accion: 'creacion', fechaHora: new Date('2026-05-28T14:00:00'), valorNuevo: JSON.stringify({ estado: 'abierta' }) },
      { ordenId: ordenes[3].id, usuarioId: tec1.id, accion: 'resolucion', fechaHora: new Date('2026-05-29T11:00:00'), valorAnterior: JSON.stringify({ estado: 'en_proceso' }), valorNuevo: JSON.stringify({ estado: 'resuelta' }) },
    ]);

    console.log('✅ Historial creado.');
    console.log('\n🎉 Semilla completada exitosamente!');
    console.log('\n📋 Usuarios de prueba (contraseña: password123):');
    console.log('   admin@dds.com         → rol: admin');
    console.log('   mantenimiento@dds.com → rol: mantenimiento');
    console.log('   tecnico1@dds.com      → rol: tecnico');
    console.log('   tecnico2@dds.com      → rol: tecnico');
    console.log('   tecnico3@dds.com      → rol: tecnico');
    console.log('   ana@dds.com           → rol: solicitante');
    console.log('   bruno@dds.com         → rol: solicitante');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error en semilla:', err);
    process.exit(1);
  }
};

seed();
