import React, { useEffect, useState } from 'react'
import api from '../api'

export default function Ordenes(){
  const [ordenes, setOrdenes] = useState([])
  useEffect(()=>{
    api.get('/ordenes').then(r=>setOrdenes(r.data)).catch(()=>setOrdenes([]))
  },[])

  return (
    <div>
      <h2>Órdenes</h2>
      <table className="table">
        <thead><tr><th>ID</th><th>Título</th><th>Activo</th><th>Estado</th><th>Prioridad</th></tr></thead>
        <tbody>
          {ordenes.map(o=> (
            <tr key={o.id}><td>{o.id}</td><td>{o.titulo}</td><td>{o.activoId}</td><td>{o.estado}</td><td>{o.prioridad}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
