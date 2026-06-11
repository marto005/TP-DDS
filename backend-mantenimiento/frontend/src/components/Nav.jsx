import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { isAuthenticated, logout } from '../auth'
import { currentUser } from '../services/authService'

export default function Nav(){
  const navigate = useNavigate()
  const user = currentUser()
  const handleLogout = () => { logout(); navigate('/login') }
  return (
    <nav className="nav">
      <div className="nav-left">
        <Link to="/">Mantenimiento</Link>
      </div>
      <div className="nav-right">
        {isAuthenticated() ? (
          <>
            <Link to="/activos">Activos</Link>
            <Link to="/ordenes">Órdenes</Link>
            {(user?.rol === 'admin' || user?.rol === 'mantenimiento') && <Link to="/usuarios">Usuarios</Link>}
            <button onClick={handleLogout}>Salir</button>
          </>
        ) : (
          <Link to="/login">Ingresar</Link>
        )}
      </div>
    </nav>
  )
}
