import React, { useEffect, useState } from 'react'
import api from '../api'

export default function Usuarios(){
  const [users, setUsers] = useState([])
  useEffect(()=>{ api.get('/usuarios').then(r=>setUsers(r.data)).catch(()=>setUsers([])) },[])
  return (
    <div>
      <h2>Usuarios</h2>
      <table className="table">
        <thead><tr><th>ID</th><th>Nombre</th><th>Email</th><th>Rol</th></tr></thead>
        <tbody>{users.map(u=>(<tr key={u.id}><td>{u.id}</td><td>{u.nombre}</td><td>{u.email}</td><td>{u.rol}</td></tr>))}</tbody>
      </table>
    </div>
  )
}
