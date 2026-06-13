import { useState, useEffect } from 'react';
import { ordenesService } from '../../services/ordenesService';
import { Loading } from '../common/Loading';

function formatFechaHora(iso) {
  if (!iso) return '-';
  return new Date(iso).toLocaleString('es-AR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

const ACCION_CONFIG = {
  creacion:       { icon: 'fa-plus-circle', color: 'text-success', label: 'Creación' },
  asignacion:     { icon: 'fa-user-check',  color: 'text-primary', label: 'Asignación' },
  cambio_prioridad: { icon: 'fa-flag',      color: 'text-warning', label: 'Cambio de prioridad' },
  cambio_estado:  { icon: 'fa-arrows-rotate', color: 'text-info',  label: 'Cambio de estado' },
  resolucion:     { icon: 'fa-check-circle', color: 'text-success', label: 'Resolución' },
  cancelacion:    { icon: 'fa-ban',          color: 'text-danger',  label: 'Cancelación' },
  edicion:        { icon: 'fa-pen',          color: 'text-secondary', label: 'Edición' },
};

export function HistorialOrden({ ordenId }) {
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    ordenesService.historial(ordenId)
      .then(setHistorial)
      .catch(console.error)
      .finally(() => setCargando(false));
  }, [ordenId]);

  if (cargando) return <Loading texto="Cargando historial..." />;

  if (historial.length === 0) {
    return <p className="text-muted small">Sin registros en el historial.</p>;
  }

  return (
    <div className="historial-timeline">
      {historial.map((h) => {
        const cfg = ACCION_CONFIG[h.accion] || { icon: 'fa-circle', color: 'text-muted', label: h.accion };
        return (
          <div key={h.id} className="historial-item">
            <div className="d-flex align-items-start gap-2">
              <i className={`fa-solid ${cfg.icon} ${cfg.color} mt-1`} style={{ minWidth: 16 }}></i>
              <div className="flex-grow-1">
                <div className="d-flex justify-content-between">
                  <strong className="small">{cfg.label}</strong>
                  <small className="text-muted">{formatFechaHora(h.fechaHora)}</small>
                </div>
                <small className="text-muted d-block">
                  por <strong>{h.usuario?.nombre || 'Sistema'}</strong>
                  {h.usuario?.rol && ` (${h.usuario.rol})`}
                </small>
                {(h.valorAnterior || h.valorNuevo) && (
                  <div className="mt-1">
                    {h.valorAnterior && (
                      <small className="text-danger me-2">
                        <i className="fa-solid fa-arrow-right me-1"></i>
                        Antes: {JSON.stringify(h.valorAnterior)}
                      </small>
                    )}
                    {h.valorNuevo && (
                      <small className="text-success">
                        <i className="fa-solid fa-arrow-right me-1"></i>
                        Después: {JSON.stringify(h.valorNuevo)}
                      </small>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
