import React, { useEffect, useState } from 'react'
import api from '../api'
import { Link } from 'react-router-dom'

export default function Activos(){
  const [activos, setActivos] = useState([])
  useEffect(()=>{
    api.get('/activos').then(r=>setActivos(r.data)).catch(()=>setActivos([]))
  },[])

  return (
    <div>
      <h2>Activos</h2>
      <Link to="/ordenes/nueva" className="btn">Crear orden</Link>
      <table className="table">
        <thead><tr><th>Codigo</th><th>Nombre</th><th>Ubicación</th><th>Estado</th></tr></thead>
        <tbody>
          {activos.map(a=> (
            <tr key={a.id}><td>{a.codigo}</td><td>{a.nombre}</td><td>{a.ubicacion}</td><td>{a.estado}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
