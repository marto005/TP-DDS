import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Loading } from '../components/common/Loading';
import { ErrorMsg } from '../components/common/ErrorMsg';
import { BadgeEstado, BadgePrioridad, BadgeCriticidad } from '../components/common/Badge';
import { OrdenAcciones } from '../components/ordenes/OrdenAcciones';
import { HistorialOrden } from '../components/ordenes/HistorialOrden';
import { ordenesService } from '../services/ordenesService';
import { usuariosService } from '../services/usuariosService';
import { useAuth } from '../context/AuthContext';

function formatFechaHora(iso) {
  if (!iso) return '-';
  return new Date(iso).toLocaleString('es-AR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function Campo({ label, children }) {
  return (
    <div className="mb-3">
      <small className="text-muted d-block fw-semibold text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}>
        {label}
      </small>
      <div>{children}</div>
    </div>
  );
}

export function OrdenDetalle() {
  const { id } = useParams();
  const { esAdmin } = useAuth();
  const [orden, setOrden] = useState(null);
  const [tecnicos, setTecnicos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const o = await ordenesService.obtener(id);
      setOrden(o);
    } catch (err) {
      setError(err?.response?.status === 404
        ? 'La orden no existe.'
        : err?.response?.data?.error || 'Error al cargar la orden.'
      );
    } finally {
      setCargando(false);
    }
  }, [id]);

  useEffect(() => {
    cargar();
    usuariosService.tecnicos().then(setTecnicos).catch(() => {});
  }, [cargar]);

  if (cargando) return <Layout titulo="Detalle de Orden"><Loading /></Layout>;

  if (error) return (
    <Layout titulo="Detalle de Orden">
      <ErrorMsg error={error} />
      <Link to="/ordenes" className="btn btn-outline-secondary mt-2">
        <i className="fa-solid fa-arrow-left me-1"></i> Volver
      </Link>
    </Layout>
  );

  return (
    <Layout titulo={`Orden #${orden.id}`}>
      <div className="d-flex gap-2 mb-3">
        <Link to="/ordenes" className="btn btn-outline-secondary btn-sm">
          <i className="fa-solid fa-arrow-left me-1"></i> Volver
        </Link>
        {esAdmin() && !['resuelta', 'cancelada'].includes(orden.estado) && (
          <Link to={`/ordenes/${orden.id}/editar`} className="btn btn-outline-primary btn-sm">
            <i className="fa-solid fa-pen me-1"></i> Editar
          </Link>
        )}
      </div>

      <div className="row g-3">
        {/* Panel principal */}
        <div className="col-md-8">
          <div className="card mb-3">
            <div className="card-header d-flex justify-content-between align-items-center">
              <span className="fw-semibold">
                <i className="fa-solid fa-file-lines me-2 text-primary"></i>
                {orden.titulo}
              </span>
              <div className="d-flex gap-2">
                <BadgePrioridad prioridad={orden.prioridad} />
                <BadgeEstado estado={orden.estado} />
              </div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <Campo label="Descripción">
                    <p className="mb-0">{orden.descripcion}</p>
                  </Campo>
                  <Campo label="Solicitante">
                    <i className="fa-solid fa-user me-1 text-muted"></i>
                    {orden.solicitante?.nombre}
                    <small className="text-muted ms-1">({orden.solicitante?.email})</small>
                  </Campo>
                  <Campo label="Técnico asignado">
                    {orden.tecnico
                      ? <><i className="fa-solid fa-user-gear me-1 text-primary"></i>{orden.tecnico.nombre}</>
                      : <span className="text-muted fst-italic">Sin asignar</span>}
                  </Campo>
                </div>
                <div className="col-md-6">
                  <Campo label="Fecha de creación">
                    <i className="fa-regular fa-calendar me-1 text-muted"></i>
                    {formatFechaHora(orden.fechaCreacion)}
                  </Campo>
                  {orden.fechaResolucion && (
                    <Campo label="Fecha de resolución">
                      <i className="fa-regular fa-calendar-check me-1 text-success"></i>
                      {formatFechaHora(orden.fechaResolucion)}
                    </Campo>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Activo asociado */}
          {orden.activo && (
            <div className="card mb-3">
              <div className="card-header">
                <i className="fa-solid fa-microchip me-2 text-secondary"></i>
                Activo asociado
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <Campo label="Nombre"><strong>{orden.activo.nombre}</strong></Campo>
                    <Campo label="Código"><code>{orden.activo.codigo}</code></Campo>
                    <Campo label="Tipo">{orden.activo.tipo}</Campo>
                  </div>
                  <div className="col-md-6">
                    <Campo label="Ubicación">
                      <i className="fa-solid fa-location-dot me-1 text-muted"></i>
                      {orden.activo.ubicacion}
                    </Campo>
                    <Campo label="Estado operativo">
                      {orden.activo.estado?.replace('_', ' ')}
                    </Campo>
                    <Campo label="Criticidad">
                      <BadgeCriticidad criticidad={orden.activo.criticidad} />
                    </Campo>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Historial */}
          <div className="card">
            <div className="card-header">
              <i className="fa-solid fa-clock-rotate-left me-2 text-secondary"></i>
              Historial de cambios
            </div>
            <div className="card-body">
              <HistorialOrden ordenId={id} />
            </div>
          </div>
        </div>

        {/* Panel lateral: acciones */}
        <div className="col-md-4">
          <OrdenAcciones
            orden={orden}
            tecnicos={tecnicos}
            onActualizada={cargar}
          />

          {/* Info rápida */}
          <div className="card mt-3">
            <div className="card-header">
              <i className="fa-solid fa-circle-info me-2 text-muted"></i>
              Información
            </div>
            <ul className="list-group list-group-flush small">
              <li className="list-group-item d-flex justify-content-between">
                <span className="text-muted">ID</span>
                <strong>#{orden.id}</strong>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span className="text-muted">Estado</span>
                <BadgeEstado estado={orden.estado} />
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span className="text-muted">Prioridad</span>
                <BadgePrioridad prioridad={orden.prioridad} />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
