import React, { useEffect, useState } from 'react'
import api from '../api'

export default function Usuarios(){
  const [users, setUsers] = useState([])
  const [error, setError] = useState(null)

  useEffect(()=>{
    api.get('/usuarios')
      .then(r=>setUsers(Array.isArray(r.data) ? r.data : []))
      .catch((e)=>setError(e.response?.data?.error || 'No se pudieron cargar los usuarios'))
  },[])
  return (
    <div>
      <h2>Usuarios</h2>
      {error && <div className="error">{error}</div>}
      <table className="table">
        <thead><tr><th>ID</th><th>Nombre</th><th>Email</th><th>Rol</th></tr></thead>
        <tbody>
          {users.length === 0 ? (
            <tr><td colSpan="4">No hay usuarios para mostrar.</td></tr>
          ) : users.map(u=>(<tr key={u.id}><td>{u.id}</td><td>{u.nombre}</td><td>{u.email}</td><td>{u.rol}</td></tr>))}
        </tbody>
      </table>
    </div>
  )
}
