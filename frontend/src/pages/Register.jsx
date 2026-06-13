import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { LoadingInline } from '../components/common/Loading';
import { ErrorMsg } from '../components/common/ErrorMsg';
import { SuccessMsg } from '../components/common/ErrorMsg';

const ROLES = ['solicitante', 'tecnico', 'mantenimiento', 'admin'];

export function Register() {
  const [form, setForm] = useState({ nombre: '', email: '', password: '', rol: 'solicitante' });
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(null);
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { nombre, email, password } = form;
    if (!nombre || !email || !password) {
      setError('Completá todos los campos obligatorios.');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    setCargando(true);
    try {
      await authService.registrar(form);
      setExito('¡Cuenta creada! Redirigiendo al login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err?.response?.data?.error || 'Error al registrar. Intentá de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card card shadow-lg">
        <div className="card-header">
          <i className="fa-solid fa-user-plus fa-2x mb-2"></i>
          <h4 className="mb-0">Crear cuenta</h4>
          <small className="opacity-75">Sistema de Mantenimiento</small>
        </div>
        <div className="card-body p-4">
          <ErrorMsg error={error} />
          <SuccessMsg mensaje={exito} />
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label className="form-label fw-semibold">Nombre completo</label>
              <input
                type="text"
                name="nombre"
                className="form-control"
                placeholder="Tu nombre"
                value={form.nombre}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="tu@email.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Contraseña</label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Mínimo 6 caracteres"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="form-label fw-semibold">Rol</label>
              <select
                name="rol"
                className="form-select"
                value={form.rol}
                onChange={handleChange}
              >
                {ROLES.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={cargando}
            >
              {cargando ? <><LoadingInline /> Registrando...</> : 'Crear cuenta'}
            </button>
          </form>
          <hr className="my-3" />
          <Link to="/login" className="btn btn-outline-secondary w-100 btn-sm">
            <i className="fa-solid fa-arrow-left me-1"></i>
            Volver al login
          </Link>
        </div>
      </div>
    </div>
  );
}
