import { useState } from 'react';

const ESTADOS = ['abierta', 'asignada', 'en_proceso', 'resuelta', 'cancelada'];
const PRIORIDADES = ['baja', 'media', 'alta', 'urgente'];

export function OrdenFiltros({ activos = [], tecnicos = [], onFiltrar, cargando }) {
  const [filtros, setFiltros] = useState({
    activoId: '',
    estado: '',
    prioridad: '',
    tecnicoId: '',
    page: 1,
    limit: 10,
    sortBy: 'fechaCreacion',
    order: 'desc',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value, page: 1 }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Eliminar valores vacíos para no ensuciar la query
    const params = {};
    Object.entries(filtros).forEach(([k, v]) => {
      if (v !== '') params[k] = v;
    });
    onFiltrar(params);
  };

  const limpiar = () => {
    const reset = {
      activoId: '', estado: '', prioridad: '', tecnicoId: '',
      page: 1, limit: 10, sortBy: 'fechaCreacion', order: 'desc',
    };
    setFiltros(reset);
    onFiltrar({ page: 1, limit: 10, sortBy: 'fechaCreacion', order: 'desc' });
  };

  return (
    <div className="card mb-3">
      <div className="card-body py-3">
        <form onSubmit={handleSubmit}>
          <div className="row g-2 align-items-end">
            {/* Filtro activo */}
            <div className="col-6 col-md-3">
              <label className="form-label small fw-semibold mb-1">Activo</label>
              <select
                name="activoId"
                className="form-select form-select-sm"
                value={filtros.activoId}
                onChange={handleChange}
              >
                <option value="">Todos los activos</option>
                {activos.map(a => (
                  <option key={a.id} value={a.id}>{a.nombre}</option>
                ))}
              </select>
            </div>

            {/* Filtro estado */}
            <div className="col-6 col-md-2">
              <label className="form-label small fw-semibold mb-1">Estado</label>
              <select
                name="estado"
                className="form-select form-select-sm"
                value={filtros.estado}
                onChange={handleChange}
              >
                <option value="">Todos</option>
                {ESTADOS.map(e => (
                  <option key={e} value={e}>{e.replace('_', ' ')}</option>
                ))}
              </select>
            </div>

            {/* Filtro prioridad */}
            <div className="col-6 col-md-2">
              <label className="form-label small fw-semibold mb-1">Prioridad</label>
              <select
                name="prioridad"
                className="form-select form-select-sm"
                value={filtros.prioridad}
                onChange={handleChange}
              >
                <option value="">Todas</option>
                {PRIORIDADES.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Filtro técnico */}
            <div className="col-6 col-md-2">
              <label className="form-label small fw-semibold mb-1">Técnico</label>
              <select
                name="tecnicoId"
                className="form-select form-select-sm"
                value={filtros.tecnicoId}
                onChange={handleChange}
              >
                <option value="">Todos</option>
                {tecnicos.map(t => (
                  <option key={t.id} value={t.id}>{t.nombre}</option>
                ))}
              </select>
            </div>

            {/* Ordenamiento */}
            <div className="col-6 col-md-2">
              <label className="form-label small fw-semibold mb-1">Ordenar por</label>
              <select
                name="sortBy"
                className="form-select form-select-sm"
                value={filtros.sortBy}
                onChange={handleChange}
              >
                <option value="fechaCreacion">Fecha</option>
                <option value="prioridad">Prioridad</option>
                <option value="estado">Estado</option>
                <option value="id">ID</option>
              </select>
            </div>

            {/* Botones */}
            <div className="col-12 col-md-1 d-flex gap-1">
              <button
                type="submit"
                className="btn btn-primary btn-sm flex-fill"
                disabled={cargando}
              >
                <i className="fa-solid fa-filter"></i>
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm flex-fill"
                onClick={limpiar}
                title="Limpiar filtros"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
