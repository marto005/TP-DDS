import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { LoadingInline } from '../components/common/Loading';
import { ErrorMsg } from '../components/common/ErrorMsg';

export function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);
  const { iniciarSesion } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/ordenes';

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Completá email y contraseña.');
      return;
    }
    setCargando(true);
    setError(null);
    try {
      const { token, usuario } = await authService.login(form.email, form.password);
      iniciarSesion(token, usuario);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.error || 'Credenciales inválidas.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card card shadow-lg">
        <div className="card-header">
          <i className="fa-solid fa-wrench fa-2x mb-2"></i>
          <h4 className="mb-0">Control de Mantenimiento</h4>
          <small className="opacity-75">DDS 2026 — 3K6</small>
        </div>
        <div className="card-body p-4">
          <h6 className="text-muted mb-3 text-center">Iniciá sesión para continuar</h6>
          <ErrorMsg error={error} />
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label className="form-label fw-semibold">Email</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fa-solid fa-envelope text-muted"></i>
                </span>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="usuario@dds.com"
                  value={form.email}
                  onChange={handleChange}
                  autoFocus
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="form-label fw-semibold">Contraseña</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fa-solid fa-lock text-muted"></i>
                </span>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={cargando}
            >
              {cargando ? <><LoadingInline /> Ingresando...</> : 'Ingresar'}
            </button>
          </form>

          <hr className="my-3" />
          <p className="text-center text-muted small mb-2">¿No tenés cuenta?</p>
          <Link to="/register" className="btn btn-outline-secondary w-100 btn-sm">
            Registrarse
          </Link>

          {/* Hint de usuarios de prueba */}
          <div className="alert alert-light border mt-3 mb-0 small">
            <strong><i className="fa-solid fa-circle-info me-1 text-primary"></i>Usuarios semilla</strong>
            <div className="mt-1 font-monospace small">
              admin@dds.com<br />
              mantenimiento@dds.com<br />
              tecnico1@dds.com<br />
              ana@dds.com<br />
              <em className="text-muted">Contraseña: password123</em>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
