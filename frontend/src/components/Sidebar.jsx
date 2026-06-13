import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Sidebar() {
  const { usuario, esAdmin } = useAuth();

  return (
    <nav className="sidebar d-flex flex-column">
      <div className="brand">
        <i className="fa-solid fa-wrench me-2"></i>
        Mantenimiento
      </div>

      <ul className="nav flex-column mt-1">
        <li className="nav-item">
          <NavLink
            to="/ordenes"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <i className="fa-solid fa-list-check"></i>
            Órdenes
          </NavLink>
        </li>

        {(esAdmin() || usuario?.rol === 'solicitante') && (
          <li className="nav-item">
            <NavLink
              to="/ordenes/nueva"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <i className="fa-solid fa-plus-circle"></i>
              Nueva Orden
            </NavLink>
          </li>
        )}

        {esAdmin() && (
          <li className="nav-item">
            <NavLink
              to="/resumen"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <i className="fa-solid fa-chart-bar"></i>
              Panel Resumen
            </NavLink>
          </li>
        )}
      </ul>

      <div className="mt-auto p-3 border-top border-secondary">
        <small className="text-white-50 d-block">
          <i className="fa-solid fa-user me-1"></i>
          {usuario?.nombre}
        </small>
        <small className="text-white-50">
          <span className={`badge me-1 ${
            usuario?.rol === 'admin' ? 'bg-danger' :
            usuario?.rol === 'mantenimiento' ? 'bg-warning text-dark' :
            usuario?.rol === 'tecnico' ? 'bg-info text-dark' : 'bg-secondary'
          }`}>{usuario?.rol}</span>
        </small>
      </div>
    </nav>
  );
}
