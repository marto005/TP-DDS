import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function NotFound() {
  const { autenticado } = useAuth();

  return (
    <div className="d-flex flex-column align-items-center justify-content-center"
      style={{ minHeight: '100vh', background: '#f4f6f9' }}>
      <div className="text-center">
        <i className="fa-solid fa-triangle-exclamation text-warning" style={{ fontSize: '5rem' }}></i>
        <h1 className="display-4 fw-bold mt-3">404</h1>
        <h4 className="text-muted">Página no encontrada</h4>
        <p className="text-muted">La ruta que buscás no existe o fue movida.</p>
        <div className="d-flex gap-2 justify-content-center mt-4">
          {autenticado
            ? <Link to="/ordenes" className="btn btn-primary">
                <i className="fa-solid fa-arrow-left me-1"></i> Ir a Órdenes
              </Link>
            : <Link to="/login" className="btn btn-primary">
                <i className="fa-solid fa-right-to-bracket me-1"></i> Iniciar sesión
              </Link>
          }
        </div>
      </div>
    </div>
  );
}
