import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ordenesService } from '../../services/ordenesService';
import { LoadingInline } from '../common/Loading';
import { ErrorMsg } from '../common/ErrorMsg';

export function OrdenAcciones({ orden, tecnicos = [], onActualizada }) {
  const { usuario, esAdmin, esTecnico } = useAuth();
  const [tecnicoId, setTecnicoId] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  if (!orden) return null;

  const puedeAsignar = esAdmin() && ['abierta', 'asignada'].includes(orden.estado);
  const puedeResolver =
    (esTecnico() && orden.tecnicoId === usuario?.id && orden.estado === 'en_proceso') ||
    (esAdmin() && orden.estado === 'en_proceso');
  const puedeProcesar =
    (esTecnico() && orden.tecnicoId === usuario?.id && orden.estado === 'asignada') ||
    (esAdmin() && orden.estado === 'asignada');
  const puedeCancelar =
    !['resuelta', 'cancelada'].includes(orden.estado) &&
    (esAdmin() ||
      (usuario?.rol === 'solicitante' && orden.solicitanteId === usuario?.id && orden.estado === 'abierta'));

  const accion = async (fn, label) => {
    setError(null);
    setCargando(true);
    try {
      await fn();
      onActualizada && onActualizada();
    } catch (err) {
      setError(err?.response?.data?.error || `Error al ${label}.`);
    } finally {
      setCargando(false);
    }
  };

  const handleAsignar = () => {
    if (!tecnicoId) { setError('Seleccioná un técnico.'); return; }
    accion(() => ordenesService.asignar(orden.id, Number(tecnicoId)), 'asignar');
  };

  const hayAcciones = puedeAsignar || puedeResolver || puedeProcesar || puedeCancelar;
  if (!hayAcciones) return null;

  return (
    <div className="card">
      <div className="card-header">
        <i className="fa-solid fa-bolt me-2 text-warning"></i>
        Acciones
      </div>
      <div className="card-body">
        <ErrorMsg error={error} />

        {/* Asignar técnico */}
        {puedeAsignar && (
          <div className="mb-3">
            <label className="form-label small fw-semibold">Asignar técnico</label>
            <div className="input-group input-group-sm">
              <select
                className="form-select"
                value={tecnicoId}
                onChange={e => setTecnicoId(e.target.value)}
                disabled={cargando}
              >
                <option value="">Seleccionar técnico...</option>
                {tecnicos.map(t => (
                  <option key={t.id} value={t.id}>{t.nombre}</option>
                ))}
              </select>
              <button
                className="btn btn-primary"
                onClick={handleAsignar}
                disabled={cargando || !tecnicoId}
              >
                {cargando ? <LoadingInline /> : <i className="fa-solid fa-user-check"></i>}
                {' '}Asignar
              </button>
            </div>
          </div>
        )}

        {/* En proceso */}
        {puedeProcesar && (
          <button
            className="btn btn-warning btn-sm w-100 mb-2"
            onClick={() => accion(
              () => ordenesService.editar(orden.id, { estado: 'en_proceso' }),
              'pasar a en proceso'
            )}
            disabled={cargando}
          >
            {cargando ? <LoadingInline /> : <i className="fa-solid fa-play me-1"></i>}
            Iniciar trabajo (→ en_proceso)
          </button>
        )}

        {/* Resolver */}
        {puedeResolver && (
          <button
            className="btn btn-success btn-sm w-100 mb-2"
            onClick={() => accion(() => ordenesService.resolver(orden.id), 'resolver')}
            disabled={cargando}
          >
            {cargando ? <LoadingInline /> : <i className="fa-solid fa-check me-1"></i>}
            Marcar como resuelta
          </button>
        )}

        {/* Cancelar */}
        {puedeCancelar && (
          <button
            className="btn btn-outline-danger btn-sm w-100"
            onClick={() => {
              if (confirm('¿Confirmar cancelación de esta orden?'))
                accion(() => ordenesService.cancelar(orden.id), 'cancelar');
            }}
            disabled={cargando}
          >
            {cargando ? <LoadingInline /> : <i className="fa-solid fa-ban me-1"></i>}
            Cancelar orden
          </button>
        )}
      </div>
    </div>
  );
}
