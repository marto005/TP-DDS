# TP DDS

## Arranque rapido

Para abrir backend y frontend en ventanas separadas:

```powershell
cd "C:\Users\marti\Desktop\facu\3er año\DDS\TP-PRE-PARCIAL\TP-DDS"
.\start-dev.cmd
```

Si queres volver a cargar la semilla junto con el arranque:

```powershell
cd "C:\Users\marti\Desktop\facu\3er año\DDS\TP-PRE-PARCIAL\TP-DDS"
.\start-dev.cmd -Seed
```

Para probar el script sin abrir ventanas:

```powershell
cd "C:\Users\marti\Desktop\facu\3er año\DDS\TP-PRE-PARCIAL\TP-DDS"
powershell -NoProfile -ExecutionPolicy Bypass -File .\start-dev.ps1 -DryRun
```
# 🔧 Control de Órdenes de Mantenimiento — DDS 2026 (3K6)

Sistema full stack para gestión de órdenes de mantenimiento sobre activos. Desarrollado con **Node.js + Express + Sequelize + SQLite** (backend) y **React + Vite + Bootstrap** (frontend).

---

## 📁 Estructura de carpetas

```
mantenimiento-dds2026/
├── backend/                    ← Node.js + Express + SQLite
│   ├── src/
│   │   ├── app.js              ← Express app (middlewares + rutas)
│   │   ├── server.js           ← Punto de entrada, conecta DB
│   │   ├── config/
│   │   │   └── database.js     ← Sequelize + SQLite (memoria en test)
│   │   ├── models/             ← Sequelize ORM
│   │   │   ├── index.js        ← Asociaciones entre modelos
│   │   │   ├── Usuario.js
│   │   │   ├── Activo.js
│   │   │   ├── Orden.js
│   │   │   └── HistorialOrden.js
│   │   ├── routes/             ← Express Router por recurso
│   │   │   ├── auth.routes.js
│   │   │   ├── activos.routes.js
│   │   │   ├── ordenes.routes.js
│   │   │   └── usuarios.routes.js
│   │   ├── controllers/        ← Reciben req/res, delegan a servicios
│   │   ├── services/           ← Reglas de negocio y dominio
│   │   │   ├── ordenService.js ← Toda la lógica de órdenes
│   │   │   └── authService.js
│   │   ├── middlewares/
│   │   │   ├── autenticar.js   ← Verifica JWT
│   │   │   ├── autorizar.js    ← Verifica roles
│   │   │   ├── validaciones.js ← Valida inputs de entrada
│   │   │   └── errorHandler.js ← Manejo centralizado (err,req,res,next)
│   │   ├── seeders/
│   │   │   └── seed.js         ← 7 usuarios, 8 activos, 15 órdenes
│   │   └── tests/
│   │       ├── helpers.js
│   │       ├── auth.test.js
│   │       └── ordenes.test.js ← 10+ casos de prueba
│   ├── .env                    ← Variables de entorno
│   └── package.json
│
└── frontend/                   ← React + Vite + Bootstrap
    ├── src/
    │   ├── App.jsx             ← Router principal con todas las rutas
    │   ├── main.jsx            ← Entry point + imports Bootstrap/FA
    │   ├── index.css           ← Estilos globales (sidebar, badges...)
    │   ├── context/
    │   │   └── AuthContext.jsx ← usuario, token, rol + localStorage
    │   ├── services/           ← Capa Axios separada por recurso
    │   │   ├── api.js          ← Instancia con baseURL + interceptores JWT
    │   │   ├── authService.js
    │   │   ├── ordenesService.js
    │   │   ├── activosService.js
    │   │   └── usuariosService.js
    │   ├── components/
    │   │   ├── Layout.jsx      ← Sidebar + Topbar + main-content
    │   │   ├── Sidebar.jsx     ← Navegación lateral con rol
    │   │   ├── Topbar.jsx      ← Barra superior + logout
    │   │   ├── ProtectedRoute.jsx
    │   │   ├── common/
    │   │   │   ├── Badge.jsx   ← BadgeEstado, BadgePrioridad, BadgeCriticidad
    │   │   │   ├── Loading.jsx
    │   │   │   └── ErrorMsg.jsx
    │   │   └── ordenes/
    │   │       ├── OrdenFiltros.jsx  ← Filtros combinables
    │   │       ├── OrdenTabla.jsx    ← Tabla de órdenes
    │   │       ├── OrdenAcciones.jsx ← Botones según rol
    │   │       ├── HistorialOrden.jsx← Timeline de cambios
    │   │       └── Paginacion.jsx
    │   └── pages/
    │       ├── Login.jsx
    │       ├── Register.jsx
    │       ├── OrdenesList.jsx
    │       ├── OrdenDetalle.jsx
    │       ├── OrdenFormPage.jsx ← Alta y edición
    │       ├── ResumenAdmin.jsx  ← Panel KPIs (solo admin/mant)
    │       └── NotFound.jsx      ← Ruta comodín *
    └── package.json
```

---

## 🚀 Instalación y ejecución

### Requisitos
- **Node.js >= 18**
- **npm >= 9**

### 1. Backend

```bash
cd backend

# Instalar dependencias
npm install

# (Opcional) Revisar variables de entorno
cat .env

# Cargar datos semilla — PRIMERA VEZ OBLIGATORIO
npm run seed

# Iniciar servidor en desarrollo
npm run dev
```

El servidor queda en **http://localhost:3000**

### 2. Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

La app queda en **http://localhost:5173**

> ℹ️ Vite redirige `/api/*` al backend en `localhost:3000` automáticamente (proxy en `vite.config.js`).

---

## 👥 Usuarios de prueba

Todos usan contraseña: **`password123`**

| Email                    | Rol            | Puede hacer                                  |
|--------------------------|----------------|----------------------------------------------|
| admin@dds.com            | admin          | Todo                                         |
| mantenimiento@dds.com    | mantenimiento  | Todo (igual que admin)                       |
| tecnico1@dds.com         | tecnico        | Ver órdenes asignadas, iniciar y resolver    |
| tecnico2@dds.com         | tecnico        | Ídem                                         |
| tecnico3@dds.com         | tecnico        | Ídem                                         |
| ana@dds.com              | solicitante    | Crear órdenes, ver las propias, cancelar abiertas |
| bruno@dds.com            | solicitante    | Ídem                                         |

> Las contraseñas se almacenan como **bcrypt hash** (salt rounds=10). Nunca se devuelven en respuestas.

---

## 🔗 Endpoints del backend

### Auth
| Método | Ruta                    | Auth | Descripción              |
|--------|-------------------------|------|--------------------------|
| POST   | `/api/auth/register`    | ❌   | Registrar usuario        |
| POST   | `/api/auth/login`       | ❌   | Login → devuelve JWT     |

### Activos
| Método | Ruta              | Auth | Descripción              |
|--------|-------------------|------|--------------------------|
| GET    | `/api/activos`    | ✅   | Listar (filtros: estado, criticidad) |
| GET    | `/api/activos/:id`| ✅   | Detalle de activo        |

### Órdenes
| Método | Ruta                          | Auth | Roles              | Descripción             |
|--------|-------------------------------|------|--------------------|-------------------------|
| GET    | `/api/ordenes`                | ✅   | todos              | Listar (filtros + paginación); solicitante ve solo las propias y técnico solo las asignadas |
| GET    | `/api/ordenes/resumen`        | ✅   | admin, mant        | KPIs agregados          |
| GET    | `/api/ordenes/:id`            | ✅   | todos              | Detalle; aplica control de propiedad/rol |
| GET    | `/api/ordenes/:id/historial`  | ✅   | todos              | Historial; aplica control de propiedad/rol |
| POST   | `/api/ordenes`                | ✅   | sol, admin, mant   | Crear orden             |
| PUT    | `/api/ordenes/:id`            | ✅   | según permisos     | Editar campos           |
| PATCH  | `/api/ordenes/:id/cancelar`   | ✅   | según permisos     | Cancelar orden          |
| PATCH  | `/api/ordenes/:id/asignar`    | ✅   | admin, mant        | Asignar técnico         |
| PATCH  | `/api/ordenes/:id/resolver`   | ✅   | tecnico, admin, mant| Resolver orden         |

### Usuarios
| Método | Ruta                    | Auth | Descripción              |
|--------|-------------------------|------|--------------------------|
| GET    | `/api/usuarios`         | ✅   | Listar (filtro: ?rol=)   |
| GET    | `/api/usuarios/tecnicos`| ✅   | Listar técnicos activos  |

### Query params para listado de órdenes
```
?activoId=1&estado=abierta&prioridad=alta&tecnicoId=3
&page=1&limit=10&sortBy=fechaCreacion&order=desc
```

---

## 🖥️ Rutas del frontend

| Ruta                  | Acceso             | Descripción              |
|-----------------------|--------------------|--------------------------|
| `/login`              | Público            | Inicio de sesión         |
| `/register`           | Público            | Registro                 |
| `/ordenes`            | Autenticado        | Listado con filtros      |
| `/ordenes/nueva`      | Sol / Admin / Mant | Formulario alta          |
| `/ordenes/:id`        | Autenticado        | Detalle + historial + acciones |
| `/ordenes/:id/editar` | Admin / Mant       | Formulario edición       |
| `/resumen`            | Admin / Mant       | Panel de KPIs            |
| `*`                   | Cualquiera         | Página 404               |

---

## ✅ Validaciones del dominio (en servicios backend)

### Activo
- Solo se crean órdenes sobre activos **existentes** y que **no estén en baja**.
- Error: `"Activo inexistente. No se puede crear la orden."` (400)
- Error: `"No se puede crear una orden sobre un activo dado de baja."` (400)

### Criticidad + Prioridad
- Si el activo tiene `criticidad = alta`, la orden **no puede tener** `prioridad = baja`.
- Error: `"Un activo de criticidad alta no puede tener una orden con prioridad baja."` (400)

### Flujo de estados
```
abierta → asignada → en_proceso → resuelta
    ↓          ↓           ↓
 cancelada  cancelada   cancelada
```
- No se puede resolver una orden cancelada.
- No se puede resolver sin técnico asignado.
- No se puede resolver si no está en `en_proceso`.

### Cambio de estado del activo
- Al **crear** una orden sobre activo `operativo` → pasa a `con_falla`.
- Al **asignar** técnico sobre activo `con_falla` → pasa a `en_mantenimiento`.
- Al **resolver** la última orden pendiente → activo vuelve a `operativo`.

---

## 🔐 JWT, roles y permisos

### Generación
El JWT se genera en `/api/auth/login`. Payload:
```json
{ "id": 1, "nombre": "Admin Sistema", "email": "admin@dds.com", "rol": "admin" }
```
> Sin datos sensibles (sin passwordHash).

### Uso en el frontend
- Se guarda en `localStorage` con clave `mant_token`.
- El interceptor de Axios lo agrega automáticamente: `Authorization: Bearer <token>`.
- Si el backend devuelve 401, el interceptor limpia la sesión y redirige a `/login`.

### Permisos por rol

| Acción                     | solicitante     | técnico         | admin/mant |
|----------------------------|-----------------|-----------------|------------|
| Crear orden                | ✅ (propias)     | ❌              | ✅         |
| Ver órdenes                | ✅               | ✅              | ✅         |
| Cancelar orden             | ✅ propias/abiertas | ❌           | ✅         |
| Asignar técnico            | ❌              | ❌              | ✅         |
| Iniciar trabajo (en_proceso)| ❌             | ✅ asignadas    | ✅         |
| Resolver orden             | ❌              | ✅ asignadas    | ✅         |
| Ver resumen/KPIs           | ❌              | ❌              | ✅         |
| Editar orden               | ✅ propias      | ❌              | ✅         |

La lectura de órdenes también queda restringida por propiedad: un solicitante solo ve sus órdenes y un técnico solo ve las órdenes asignadas.

### Respuestas de error de autenticación/autorización
- `401` → No se envía JWT o es inválido/expirado.
- `403` → JWT válido pero sin permiso para la acción.

---

## 🧪 Pruebas automatizadas

```bash
cd backend
npm test
# o con coverage:
npm run test:coverage
```

### Casos cubiertos

| # | Descripción |
|---|-------------|
| 1 | Login correcto → devuelve token |
| 2 | Login inválido (contraseña incorrecta) → 401 |
| 3 | Login email inexistente → 401 |
| 4 | GET /ordenes sin JWT → 401 |
| 5 | GET /ordenes con token válido → 200 con paginación |
| 6 | GET /ordenes con filtro por estado |
| 7 | GET /ordenes con paginación (page + limit) |
| 8 | GET /ordenes/:id existente → 200 con activo |
| 9 | GET /ordenes/:id inexistente → 404 |
| 10 | POST /ordenes válida → 201, estado abierta |
| 11 | POST /ordenes sobre activo baja → 400 /baja/i |
| 12 | POST /ordenes prioridad baja en criticidad alta → 400 |
| 13 | POST /ordenes prioridad inválida → 400 |
| 14 | POST /ordenes activo inexistente → 400 |
| 15 | POST /ordenes con técnico → 403 (no puede crear) |
| 16 | PATCH /resolver sin técnico asignado → 400 |
| 17 | PATCH /resolver orden en_proceso con técnico → 200, resuelta |
| 18 | PATCH /resolver orden cancelada → 400 |
| 19 | GET /resumen con solicitante → 403 |
| 20 | GET /resumen con admin → 200 |
| 21 | PATCH /asignar con solicitante → 403 |

---

## ⚠️ Limitaciones conocidas

- El endpoint `GET /api/usuarios/tecnicos` devuelve solo usuarios con `activo: true` y `rol: 'tecnico'`. Si se quieren todos los técnicos incluyendo inactivos, habría que ajustar el filtro.
- No hay endpoint para cambiar contraseña ni para desactivar usuarios desde el frontend (solo desde BD).
- Los tests usan base de datos SQLite **en memoria** (`':memory:'`) y se aíslan entre sí con `beforeAll`/`afterAll`. Si un test falla antes del teardown, puede afectar al siguiente en la misma sesión; en ese caso, ejecutar `npm test` de nuevo.
- El frontend muestra técnicos disponibles según los registrados en la BD. Si se agregan técnicos nuevos vía `/api/auth/register`, aparecerán automáticamente en el selector.

---

## 🛠 Decisiones técnicas

| Decisión | Razón |
|----------|-------|
| SQLite + Sequelize | Simple de ejecutar sin instalar motor externo; cumple requisito de persistencia |
| `sequelize.sync({ alter: true })` | Actualiza el esquema automáticamente en dev sin perder datos |
| `sequelize.sync({ force: true })` | En tests: resetea la BD en memoria para aislar cada suite |
| JWT en `localStorage` | Simplicidad para SPA; el interceptor Axios lo agrega automáticamente |
| Proxy en Vite | Evita CORS en desarrollo: frontend en :5173 → backend en :3000 |
| Historial en DB | Auditoría completa, no en logs. Guarda `valorAnterior` y `valorNuevo` como JSON |
| `registrarHistorial` en cada acción del servicio | Garantiza que toda mutación quede auditada, sin depender del controlador |
| Roles validados en middleware `autorizar` | Separación de responsabilidades: el servicio no mezcla auth con lógica |
