import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function Topbar({ titulo }) {
  const { usuario, cerrarSesion } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    cerrarSesion();
    navigate('/login');
  };

  return (
    <div className="topbar">
      <h5 className="mb-0 text-dark fw-semibold">
        {titulo}
      </h5>
      <div className="d-flex align-items-center gap-2">
        <span className="text-muted small">
          <i className="fa-solid fa-user-circle me-1"></i>
          {usuario?.nombre}
        </span>
        <button
          className="btn btn-sm btn-outline-danger"
          onClick={handleLogout}
          title="Cerrar sesión"
        >
          <i className="fa-solid fa-right-from-bracket"></i>
          <span className="ms-1 d-none d-md-inline">Salir</span>
        </button>
      </div>
    </div>
  );
}
