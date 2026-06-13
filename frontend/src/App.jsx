import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { OrdenesList } from './pages/OrdenesList';
import { OrdenDetalle } from './pages/OrdenDetalle';
import { OrdenFormPage } from './pages/OrdenFormPage';
import { ResumenAdmin } from './pages/ResumenAdmin';
import { NotFound } from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Ruta raíz → redirige a órdenes */}
          <Route path="/" element={<Navigate to="/ordenes" replace />} />

          {/* Rutas protegidas — requieren autenticación */}
          <Route
            path="/ordenes"
            element={
              <ProtectedRoute>
                <OrdenesList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ordenes/nueva"
            element={
              <ProtectedRoute roles={['solicitante', 'admin', 'mantenimiento']}>
                <OrdenFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ordenes/:id"
            element={
              <ProtectedRoute>
                <OrdenDetalle />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ordenes/:id/editar"
            element={
              <ProtectedRoute roles={['admin', 'mantenimiento']}>
                <OrdenFormPage />
              </ProtectedRoute>
            }
          />

          {/* Panel de administración — solo admin y mantenimiento */}
          <Route
            path="/resumen"
            element={
              <ProtectedRoute roles={['admin', 'mantenimiento']}>
                <ResumenAdmin />
              </ProtectedRoute>
            }
          />

          {/* Comodín — página no encontrada */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
