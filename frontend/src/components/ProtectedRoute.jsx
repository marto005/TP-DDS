import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { Loading } from "./common/Loading";

/**
 * Protege una ruta: redirige a /login si no está autenticado.
 * Si se pasa `roles`, solo permite acceso a esos roles.
 */
export function ProtectedRoute({ children, roles }) {
  const { autenticado, usuario, cargando } = useAuth();
  const location = useLocation();

  if (cargando) return <Loading />;

  if (!autenticado) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(usuario?.rol)) {
    return <Navigate to="/ordenes" replace />;
  }

  return children;
}
