import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'

export default function Ordenes(){
  const [data, setData] = useState({ ordenes: [], total: 0, pagina: 1, totalPaginas: 0 })
  const [error, setError] = useState(null)

  useEffect(()=>{
    api.get('/ordenes')
      .then(r=>setData(r.data || { ordenes: [] }))
      .catch((e)=>setError(e.response?.data?.error || 'No se pudieron cargar las órdenes'))
  },[])

  const ordenes = Array.isArray(data.ordenes) ? data.ordenes : []

  return (
    <div>
      <h2>Órdenes</h2>
      {error && <div className="error">{error}</div>}
      <p>Total: {data.total ?? ordenes.length}</p>
      <table className="table">
        <thead><tr><th>ID</th><th>Título</th><th>Activo</th><th>Estado</th><th>Prioridad</th></tr></thead>
        <tbody>
          {ordenes.length === 0 ? (
            <tr><td colSpan="5">No hay órdenes para mostrar.</td></tr>
          ) : ordenes.map(o=> (
            <tr key={o.id}>
              <td><Link to={`/ordenes/${o.id}`}>{o.id}</Link></td>
              <td>{o.titulo}</td>
              <td>{o.activoId}</td>
              <td>{o.estado}</td>
              <td>{o.prioridad}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
