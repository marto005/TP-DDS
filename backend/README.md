# 🔧 Backend - Control de Órdenes de Mantenimiento

**Materia:** Desarrollo de Software (DDS) - 2026  
**Curso:** 3K6  
**Stack:** Node.js + Express + Sequelize + SQLite

---

## 🚀 Instalación y ejecución

### Requisitos previos
- Node.js >= 18
- npm >= 9

### Pasos

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Editá .env si querés cambiar el puerto o el JWT_SECRET

# 3. Cargar datos semilla (primera vez)
npm run seed

# 4. Iniciar el servidor
npm run dev    # desarrollo con nodemon
npm start      # producción
```

El servidor corre en `http://localhost:3000`.

---

## 👥 Usuarios de prueba (contraseña: `password123`)

| Email                    | Rol            |
|--------------------------|----------------|
| admin@dds.com            | admin          |
| mantenimiento@dds.com    | mantenimiento  |
| tecnico1@dds.com         | tecnico        |
| tecnico2@dds.com         | tecnico        |
| tecnico3@dds.com         | tecnico        |
| ana@dds.com              | solicitante    |
| bruno@dds.com            | solicitante    |

> **Nota:** Las contraseñas están hasheadas con bcrypt (salt rounds = 10). Los usuarios semilla usan `password123` como contraseña en texto plano, que se hashea en el script `seed.js`. **Nunca** se almacena ni devuelve la contraseña en texto plano.

---

## 📋 Endpoints principales

### Autenticación
| Método | Ruta                  | Descripción              | Auth requerida |
|--------|-----------------------|--------------------------|----------------|
| POST   | /api/auth/register    | Registrar usuario        | No             |
| POST   | /api/auth/login       | Iniciar sesión           | No             |

### Activos
| Método | Ruta              | Descripción              | Auth requerida |
|--------|-------------------|--------------------------|----------------|
| GET    | /api/activos      | Listar activos           | Sí             |
| GET    | /api/activos/:id  | Detalle de activo        | Sí             |

### Órdenes
| Método | Ruta                          | Descripción                          | Roles permitidos              |
|--------|-------------------------------|--------------------------------------|-------------------------------|
| GET    | /api/ordenes                  | Listar con filtros y paginación      | Todos                         |
| GET    | /api/ordenes/resumen          | Resumen administrativo               | admin, mantenimiento          |
| GET    | /api/ordenes/:id              | Detalle de orden                     | Todos                         |
| GET    | /api/ordenes/:id/historial    | Historial de cambios                 | Todos                         |
| POST   | /api/ordenes                  | Crear orden                          | solicitante, admin, mant      |
| PUT    | /api/ordenes/:id              | Editar orden                         | según propiedad y rol         |
| PATCH  | /api/ordenes/:id/cancelar     | Cancelar orden                       | según propiedad y rol         |
| PATCH  | /api/ordenes/:id/asignar      | Asignar técnico                      | admin, mantenimiento          |
| PATCH  | /api/ordenes/:id/resolver     | Resolver orden                       | tecnico (asignado), admin     |

#### Parámetros de filtrado (GET /api/ordenes)
```
?activoId=1&estado=abierta&prioridad=alta&tecnicoId=3&page=1&limit=10&sortBy=fechaCreacion&order=desc
```

---

## 🗂️ Estructura de carpetas

```
src/
├── app.js                    # Express app (middlewares, rutas)
├── server.js                 # Entry point (sync BD + listen)
├── config/
│   └── database.js           # Sequelize + SQLite config
├── models/
│   ├── index.js              # Asociaciones entre modelos
│   ├── Usuario.js
│   ├── Activo.js
│   ├── Orden.js
│   └── HistorialOrden.js
├── routes/
│   ├── auth.routes.js
│   ├── activos.routes.js
│   └── ordenes.routes.js     # express.Router() separado
├── controllers/
│   ├── authController.js
│   ├── activoController.js
│   └── ordenController.js
├── services/
│   ├── authService.js        # Lógica de registro y login
│   └── ordenService.js       # Todas las reglas de dominio
├── middlewares/
│   ├── autenticar.js         # Verifica JWT
│   ├── autorizar.js          # Verifica rol
│   ├── validaciones.js       # Validación de entrada
│   └── errorHandler.js       # Manejo centralizado de errores
├── seeders/
│   └── seed.js               # Datos semilla
└── tests/
    ├── helpers.js            # Setup/teardown de BD en memoria
    ├── auth.test.js
    └── ordenes.test.js
```

---

## ✅ Validación de activo, prioridad y estado

### Activo
- Una orden **solo puede crearse** sobre un activo que exista y NO esté en estado `baja`.
- Validado en `ordenService.js` → `crearOrden()`.
- Responde `400` con mensaje específico.

### Prioridad
- Valores permitidos: `baja`, `media`, `alta`, `urgente`.
- Si el activo tiene `criticidad: 'alta'`, la orden **no puede tener** `prioridad: 'baja'`.
- Validado en `ordenService.js` tanto en creación como en edición.

### Estado (flujo de transiciones)
```
abierta → asignada → en_proceso → resuelta
   ↓           ↓           ↓
cancelada  cancelada   cancelada
```
- Las transiciones inválidas devuelven `400`.
- Una orden cancelada o resuelta **no puede seguir cambiando**.
- Para resolver una orden: debe estar en `en_proceso` y tener `tecnicoId` asignado.

---

## 🔐 JWT, roles y permisos

### JWT
- Se obtiene en `POST /api/auth/login`.
- Debe enviarse como `Authorization: Bearer <token>` en todas las rutas protegidas.
- **El payload NO incluye contraseñas ni datos sensibles.** Solo: `{ id, nombre, email, rol }`.
- Expiración: 24 horas (configurable en `.env`).

### Roles
| Rol           | Puede                                                                 |
|---------------|-----------------------------------------------------------------------|
| solicitante   | Crear órdenes, ver sus propias órdenes, cancelar sus órdenes abiertas |
| tecnico       | Ver órdenes asignadas, pasar a en_proceso y resolver las propias      |
| mantenimiento | Ver todo, asignar técnico, cambiar prioridad, cancelar cualquier orden|
| admin         | Todo lo anterior + sin restricciones                                  |

- La lectura de órdenes también queda restringida por propiedad: solicitante solo ve sus órdenes y técnico solo ve las asignadas.
- Rutas sin JWT → `401`
- Rutas con JWT pero sin permiso → `403`

---

## 🧪 Ejecutar pruebas

```bash
npm test
# o con cobertura:
npm run test:coverage
```

Los tests corren contra una base de datos SQLite **en memoria** (`:memory:`), aislada de la base de datos de desarrollo.

### Casos cubiertos
1. Login correcto → token válido
2. Login inválido (contraseña incorrecta, email inexistente)
3. Listado con y sin filtros
4. Detalle de orden existente e inexistente → 404
5. Creación válida de orden
6. Creación inválida por activo dado de baja → 400
7. Creación inválida por prioridad baja en activo crítico → 400
8. Resolución inválida de orden sin técnico → 400
9. Resolución inválida de orden cancelada → 400
10. Acceso sin JWT → 401
11. Acceso con JWT de rol insuficiente → 403

---

## ⚠️ Limitaciones conocidas

- La autenticación no implementa refresh tokens; al expirar el JWT hay que loguearse nuevamente.
- El endpoint de activos no tiene paginación (el enunciado no lo requería).
- La semilla destruye y recrea la base de datos (`force: true`); no ejecutar en producción.
- En entorno de test se usa SQLite en memoria; los tests no persisten datos entre corridas.
