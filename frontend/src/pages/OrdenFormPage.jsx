import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Layout } from '../components/Layout';
import { Loading } from '../components/common/Loading';
import { LoadingInline } from '../components/common/Loading';
import { ErrorMsg } from '../components/common/ErrorMsg';
import { ordenesService } from '../services/ordenesService';
import { activosService } from '../services/activosService';
import { usuariosService } from '../services/usuariosService';

const PRIORIDADES = ['baja', 'media', 'alta', 'urgente'];

const FORM_INICIAL = {
  activoId: '',
  titulo: '',
  descripcion: '',
  prioridad: 'media',
  tecnicoId: '',
};

export function OrdenFormPage() {
  const { id } = useParams();
  const esEdicion = Boolean(id);
  const navigate = useNavigate();
  const { esAdmin } = useAuth();

  const [form, setForm] = useState(FORM_INICIAL);
  const [activos, setActivos] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);
  const [erroresForm, setErroresForm] = useState({});

  // Cargar activos disponibles y técnicos
  useEffect(() => {
    activosService.listar()
      .then(data => setActivos(data.filter(a => a.estado !== 'baja')))
      .catch(() => setError('Error al cargar activos.'));

    usuariosService.tecnicos()
      .then(setTecnicos)
      .catch(() => {});
  }, []);

  // En edición: cargar la orden actual
  useEffect(() => {
    if (!esEdicion) return;
    setCargando(true);
    ordenesService.obtener(id)
      .then(o => {
        setForm({
          activoId: o.activoId || '',
          titulo: o.titulo || '',
          descripcion: o.descripcion || '',
          prioridad: o.prioridad || 'media',
          tecnicoId: o.tecnicoId || '',
        });
      })
      .catch(() => setError('No se pudo cargar la orden.'))
      .finally(() => setCargando(false));
  }, [id, esEdicion]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErroresForm(prev => ({ ...prev, [name]: '' }));
    setError(null);
  };

  const activoSeleccionado = activos.find(a => a.id === Number(form.activoId));
  const advertenciaPrioridad =
    activoSeleccionado?.criticidad === 'alta' && form.prioridad === 'baja'
      ? 'Este activo tiene criticidad alta: no se permite prioridad baja.'
      : null;

  const validar = () => {
    const err = {};
    if (!form.activoId) err.activoId = 'Seleccioná un activo.';
    if (!form.titulo.trim()) err.titulo = 'El título es obligatorio.';
    if (!form.descripcion.trim()) err.descripcion = 'La descripción es obligatoria.';
    if (!form.prioridad) err.prioridad = 'Seleccioná una prioridad.';
    if (advertenciaPrioridad) err.prioridad = advertenciaPrioridad;
    setErroresForm(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;
    setGuardando(true);
    setError(null);
    try {
      const datos = {
        activoId: Number(form.activoId),
        titulo: form.titulo.trim(),
        descripcion: form.descripcion.trim(),
        prioridad: form.prioridad,
        tecnicoId: form.tecnicoId ? Number(form.tecnicoId) : undefined,
      };
      if (esEdicion) {
        await ordenesService.editar(id, datos);
        navigate(`/ordenes/${id}`);
      } else {
        const nueva = await ordenesService.crear(datos);
        navigate(`/ordenes/${nueva.id}`);
      }
    } catch (err) {
      setError(err?.response?.data?.error || 'Error al guardar la orden.');
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) return <Layout titulo="Cargando..."><Loading /></Layout>;

  return (
    <Layout titulo={esEdicion ? `Editar Orden #${id}` : 'Nueva Orden'}>
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-7">
          <div className="card">
            <div className="card-header">
              <i className={`fa-solid ${esEdicion ? 'fa-pen' : 'fa-plus-circle'} me-2 text-primary`}></i>
              {esEdicion ? 'Editar orden de mantenimiento' : 'Crear nueva orden de mantenimiento'}
            </div>
            <div className="card-body">
              <ErrorMsg error={error} />

              {advertenciaPrioridad && (
                <div className="alert alert-warning small">
                  <i className="fa-solid fa-triangle-exclamation me-1"></i>
                  {advertenciaPrioridad}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                {/* Activo */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Activo <span className="text-danger">*</span>
                  </label>
                  <select
                    name="activoId"
                    className={`form-select ${erroresForm.activoId ? 'is-invalid' : ''}`}
                    value={form.activoId}
                    onChange={handleChange}
                    disabled={esEdicion}
                  >
                    <option value="">Seleccioná un activo...</option>
                    {activos.map(a => (
                      <option key={a.id} value={a.id}>
                        [{a.codigo}] {a.nombre} — {a.ubicacion}
                        {a.criticidad === 'alta' ? ' ⚠ alta criticidad' : ''}
                      </option>
                    ))}
                  </select>
                  {erroresForm.activoId && <div className="invalid-feedback">{erroresForm.activoId}</div>}
                  {activoSeleccionado && (
                    <div className="form-text">
                      Estado: <strong>{activoSeleccionado.estado.replace('_', ' ')}</strong>
                      &nbsp;|&nbsp;Criticidad: <strong>{activoSeleccionado.criticidad}</strong>
                    </div>
                  )}
                </div>

                {/* Título */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Título <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="titulo"
                    className={`form-control ${erroresForm.titulo ? 'is-invalid' : ''}`}
                    placeholder="Resumen breve del problema"
                    value={form.titulo}
                    onChange={handleChange}
                    maxLength={100}
                  />
                  {erroresForm.titulo && <div className="invalid-feedback">{erroresForm.titulo}</div>}
                </div>

                {/* Descripción */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Descripción <span className="text-danger">*</span>
                  </label>
                  <textarea
                    name="descripcion"
                    className={`form-control ${erroresForm.descripcion ? 'is-invalid' : ''}`}
                    rows={4}
                    placeholder="Describí el problema con detalle..."
                    value={form.descripcion}
                    onChange={handleChange}
                  />
                  {erroresForm.descripcion && <div className="invalid-feedback">{erroresForm.descripcion}</div>}
                </div>

                <div className="row g-3 mb-4">
                  {/* Prioridad */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Prioridad <span className="text-danger">*</span>
                    </label>
                    <select
                      name="prioridad"
                      className={`form-select ${erroresForm.prioridad ? 'is-invalid' : ''}`}
                      value={form.prioridad}
                      onChange={handleChange}
                    >
                      {PRIORIDADES.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                    {erroresForm.prioridad && <div className="invalid-feedback">{erroresForm.prioridad}</div>}
                  </div>

                  {/* Técnico — solo para admin/mantenimiento */}
                  {esAdmin() && (
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Técnico asignado</label>
                      <select
                        name="tecnicoId"
                        className="form-select"
                        value={form.tecnicoId}
                        onChange={handleChange}
                      >
                        <option value="">Sin asignar</option>
                        {tecnicos.map(t => (
                          <option key={t.id} value={t.id}>{t.nombre}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div className="d-flex gap-2 justify-content-end">
                  <Link
                    to={esEdicion ? `/ordenes/${id}` : '/ordenes'}
                    className="btn btn-outline-secondary"
                  >
                    Cancelar
                  </Link>
                  <button type="submit" className="btn btn-primary" disabled={guardando}>
                    {guardando
                      ? <><LoadingInline /> Guardando...</>
                      : <><i className={`fa-solid ${esEdicion ? 'fa-floppy-disk' : 'fa-plus'} me-1`}></i>
                          {esEdicion ? 'Guardar cambios' : 'Crear orden'}</>
                    }
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
