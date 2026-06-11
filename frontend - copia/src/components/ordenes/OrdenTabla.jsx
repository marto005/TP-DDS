import { Link } from 'react-router-dom';
import { BadgeEstado } from '../common/Badge';
import { BadgePrioridad } from '../common/Badge';

function formatFecha(iso) {
  if (!iso) return '-';
  return new Date(iso).toLocaleDateString('es-AR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });
}

export function OrdenTabla({ ordenes = [] }) {
  if (ordenes.length === 0) {
    return (
      <div className="empty-state">
        <i className="fa-solid fa-clipboard-list text-muted"></i>
        <p className="text-muted">No se encontraron órdenes con los filtros aplicados.</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0">
        <thead className="table-light">
          <tr>
            <th>#</th>
            <th>Título</th>
            <th>Activo</th>
            <th>Prioridad</th>
            <th>Estado</th>
            <th>Técnico</th>
            <th>Fecha</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {ordenes.map((orden) => (
            <tr key={orden.id}>
              <td className="text-muted small">{orden.id}</td>
              <td>
                <span className="fw-semibold">{orden.titulo}</span>
                <br />
                <small className="text-muted">{orden.solicitante?.nombre}</small>
              </td>
              <td>
                <small>
                  <span className="text-muted">{orden.activo?.codigo}</span>
                  <br />
                  {orden.activo?.nombre}
                </small>
              </td>
              <td><BadgePrioridad prioridad={orden.prioridad} /></td>
              <td><BadgeEstado estado={orden.estado} /></td>
              <td>
                {orden.tecnico
                  ? <small>{orden.tecnico.nombre}</small>
                  : <small className="text-muted">Sin asignar</small>}
              </td>
              <td><small>{formatFecha(orden.fechaCreacion)}</small></td>
              <td>
                <Link
                  to={`/ordenes/${orden.id}`}
                  className="btn btn-sm btn-outline-primary btn-action"
                >
                  <i className="fa-solid fa-eye"></i>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
