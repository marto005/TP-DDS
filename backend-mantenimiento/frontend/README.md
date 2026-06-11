Frontend React + Vite para el proyecto de Mantenimiento

Requisitos:
- Backend en http://localhost:3000 corriendo (ver carpeta backend)
- Node.js 18+ y npm

Instalación y ejecución:

```powershell
cd backend-mantenimiento/frontend
npm install
npm run dev
```

Notas:
- El cliente asume que la API está en `http://localhost:3000/api`.
- Autenticación: POST /api/auth/login → { email, password } → devuelve `{ token }`.
- Guardar el token en `localStorage` para llamadas autenticadas.
