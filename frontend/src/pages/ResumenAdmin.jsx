import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Loading } from '../components/common/Loading';
import { ErrorMsg } from '../components/common/ErrorMsg';
import { ordenesService } from '../services/ordenesService';

const ESTADO_COLOR = {
  abierta:    { bg: 'bg-info',      icon: 'fa-circle-dot',    label: 'Abiertas' },
  asignada:   { bg: 'bg-primary',   icon: 'fa-user-check',    label: 'Asignadas' },
  en_proceso: { bg: 'bg-warning',   icon: 'fa-spinner',       label: 'En proceso' },
  resuelta:   { bg: 'bg-success',   icon: 'fa-circle-check',  label: 'Resueltas' },
  cancelada:  { bg: 'bg-secondary', icon: 'fa-ban',           label: 'Canceladas' },
};

function StatCard({ label, valor, icon, color, footer }) {
  return (
    <div className={`card stat-card text-white ${color} h-100`}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <small className="opacity-75 fw-semibold text-uppercase" style={{ fontSize: '0.72rem' }}>
              {label}
            </small>
            <h2 className="mb-0 fw-bold">{valor}</h2>
            {footer && <small className="opacity-75">{footer}</small>}
          </div>
          <i className={`fa-solid ${icon} opacity-50`} style={{ fontSize: '2.5rem' }}></i>
        </div>
      </div>
    </div>
  );
}

export function ResumenAdmin() {
  const [resumen, setResumen] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    ordenesService.resumen()
      .then(setResumen)
      .catch(err => setError(err?.response?.data?.error || 'Error al cargar el resumen.'))
      .finally(() => setCargando(false));
  }, []);

  if (cargando) return <Layout titulo="Panel de Resumen"><Loading /></Layout>;

  if (error) return (
    <Layout titulo="Panel de Resumen">
      <ErrorMsg error={error} />
    </Layout>
  );

  // Construir mapa de estados
  const estadoMap = {};
  (resumen?.porEstado || []).forEach(e => { estadoMap[e.estado] = Number(e.total); });
  const totalActivas = (estadoMap.abierta || 0) + (estadoMap.asignada || 0) + (estadoMap.en_proceso || 0);

  return (
    <Layout titulo="Panel de Resumen">
      {/* Tarjetas de estado */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-4 col-lg">
          <StatCard
            label="Abiertas"
            valor={estadoMap.abierta || 0}
            icon="fa-circle-dot"
            color="bg-info"
          />
        </div>
        <div className="col-6 col-md-4 col-lg">
          <StatCard
            label="Asignadas"
            valor={estadoMap.asignada || 0}
            icon="fa-user-check"
            color="bg-primary"
          />
        </div>
        <div className="col-6 col-md-4 col-lg">
          <StatCard
            label="En proceso"
            valor={estadoMap.en_proceso || 0}
            icon="fa-spinner"
            color="bg-warning"
          />
        </div>
        <div className="col-6 col-md-4 col-lg">
          <StatCard
            label="Resueltas"
            valor={estadoMap.resuelta || 0}
            icon="fa-circle-check"
            color="bg-success"
          />
        </div>
        <div className="col-6 col-md-4 col-lg">
          <StatCard
            label="Canceladas"
            valor={estadoMap.cancelada || 0}
            icon="fa-ban"
            color="bg-secondary"
          />
        </div>
      </div>

      {/* Segunda fila de KPIs */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <StatCard
            label="Urgentes activas"
            valor={resumen?.urgentes || 0}
            icon="fa-triangle-exclamation"
            color="bg-danger"
            footer="No resueltas ni canceladas"
          />
        </div>
        <div className="col-md-4">
          <StatCard
            label="Sin técnico"
            valor={resumen?.sinTecnico || 0}
            icon="fa-user-xmark"
            color="bg-dark"
            footer="Pendientes de asignación"
          />
        </div>
        <div className="col-md-4">
          <StatCard
            label="Total activas"
            valor={totalActivas}
            icon="fa-list-check"
            color="bg-indigo"
            footer="Abiertas + asignadas + en proceso"
          />
        </div>
      </div>

      <div className="row g-3">
        {/* Distribución por estado */}
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header">
              <i className="fa-solid fa-chart-pie me-2"></i>
              Órdenes por estado
            </div>
            <div className="card-body">
              {(resumen?.porEstado || []).map(e => {
                const cfg = ESTADO_COLOR[e.estado] || { bg: 'bg-secondary', icon: 'fa-question', label: e.estado };
                const total = Object.values(estadoMap).reduce((a, b) => a + b, 0) || 1;
                const pct = Math.round((Number(e.total) / total) * 100);
                return (
                  <div key={e.estado} className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <div className="d-flex align-items-center gap-2">
                        <span className={`badge ${cfg.bg}`}>
                          <i className={`fa-solid ${cfg.icon}`}></i>
                        </span>
                        <span className="small fw-semibold">{cfg.label}</span>
                      </div>
                      <span className="fw-bold">{e.total}</span>
                    </div>
                    <div className="progress" style={{ height: 8 }}>
                      <div
                        className={`progress-bar ${cfg.bg}`}
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
              {(resumen?.porEstado || []).length === 0 && (
                <p className="text-muted small">Sin datos.</p>
              )}
            </div>
          </div>
        </div>

        {/* Activos con más fallas */}
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header">
              <i className="fa-solid fa-fire me-2 text-danger"></i>
              Activos con más órdenes
            </div>
            <div className="card-body p-0">
              <ul className="list-group list-group-flush">
                {(resumen?.activosConFallas || []).map((item, idx) => (
                  <li key={item.activoId} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <span className="badge bg-secondary me-2">{idx + 1}</span>
                      <strong className="small">{item.activo?.nombre}</strong>
                      <br />
                      <small className="text-muted ms-4">{item.activo?.codigo}</small>
                    </div>
                    <span className="badge bg-danger rounded-pill">{item.totalOrdenes} órdenes</span>
                  </li>
                ))}
                {(resumen?.activosConFallas || []).length === 0 && (
                  <li className="list-group-item text-muted small">Sin datos.</li>
                )}
              </ul>
            </div>
            <div className="card-footer bg-white text-end">
              <Link to="/ordenes" className="btn btn-sm btn-outline-primary">
                Ver todas las órdenes
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
