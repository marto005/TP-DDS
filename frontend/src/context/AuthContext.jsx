import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const TOKEN_KEY = 'mant_token';
const USUARIO_KEY = 'mant_usuario';

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Restaurar sesión al montar
  useEffect(() => {
    const tokenGuardado = localStorage.getItem(TOKEN_KEY);
    const usuarioGuardado = localStorage.getItem(USUARIO_KEY);
    if (tokenGuardado && usuarioGuardado) {
      try {
        setToken(tokenGuardado);
        setUsuario(JSON.parse(usuarioGuardado));
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USUARIO_KEY);
      }
    }
    setCargando(false);
  }, []);

  const iniciarSesion = (tokenRecibido, usuarioRecibido) => {
    setToken(tokenRecibido);
    setUsuario(usuarioRecibido);
    localStorage.setItem(TOKEN_KEY, tokenRecibido);
    localStorage.setItem(USUARIO_KEY, JSON.stringify(usuarioRecibido));
  };

  const cerrarSesion = () => {
    setToken(null);
    setUsuario(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USUARIO_KEY);
  };

  const esAdmin = () => usuario && ['admin', 'mantenimiento'].includes(usuario.rol);
  const esTecnico = () => usuario && usuario.rol === 'tecnico';
  const esSolicitante = () => usuario && usuario.rol === 'solicitante';

  return (
    <AuthContext.Provider value={{
      usuario,
      token,
      cargando,
      iniciarSesion,
      cerrarSesion,
      esAdmin,
      esTecnico,
      esSolicitante,
      autenticado: !!token,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
