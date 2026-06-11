import React, { useEffect, useState } from 'react'
import api from '../api'

export default function Dashboard(){
  const [summary, setSummary] = useState(null)

  useEffect(()=>{
    api.get('/ordenes/resumen')
      .then(r=>setSummary(r.data))
      .catch(()=>setSummary(null))
  },[])

  if (!summary) return <div>Cargando resumen...</div>

  return (
    <div>
      <h2>Resumen administrativo</h2>
      <ul>
        <li>Órdenes por estado: {JSON.stringify(summary.porEstado || {})}</li>
        <li>Urgentes: {summary.urgentes || 0}</li>
        <li>Sin técnico: {summary.sinTecnico || 0}</li>
        <li>Activos con más fallas: {JSON.stringify(summary.activosMasFallos || [])}</li>
      </ul>
    </div>
  )
}
