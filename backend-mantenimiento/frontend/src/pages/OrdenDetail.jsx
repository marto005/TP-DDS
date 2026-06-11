import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchOrden, asignarTecnico, cancelarOrden, resolverOrden } from '../services/ordenService'
import { currentUser } from '../services/authService'
import api from '../api'

export default function OrdenDetail(){
  const { id } = useParams()
  const [orden, setOrden] = useState(null)
  const [tecnicos, setTecnicos] = useState([])
  const [selTec, setSelTec] = useState('')
  const navigate = useNavigate()
  const user = currentUser()

  useEffect(()=>{
    fetchOrden(id).then(setOrden).catch(()=>setOrden(null))
    api.get('/usuarios').then(r=>setTecnicos(r.data.filter(u=>u.rol==='tecnico'))).catch(()=>setTecnicos([]))
  },[id])

  if (!orden) return <div>Cargando orden...</div>

  const canAssign = user && (user.rol==='admin' || user.rol==='mantenimiento')
  const canResolve = user && user.rol==='tecnico' && user.id===orden.tecnicoId
  const canCancel = user && (user.rol==='admin' || user.rol==='mantenimiento' || user.id===orden.solicitanteId)

  const doAssign = async () => {
    if (!selTec) return alert('Seleccioná un técnico')
    try{ await asignarTecnico(orden.id, selTec); const o = await fetchOrden(id); setOrden(o) }catch(e){ alert('Error asignando') }
  }
  const doCancel = async () => { if (!confirm('Confirmar cancelar')) return; try{ await cancelarOrden(orden.id); setOrden(await fetchOrden(id)) }catch(e){ alert('Error cancelando') } }
  const doResolve = async () => { if (!confirm('Confirmar resolver')) return; try{ await resolverOrden(orden.id); setOrden(await fetchOrden(id)) }catch(e){ alert('Error resolviendo') } }

  return (
    <div>
      <h2>Orden #{orden.id} - {orden.titulo}</h2>
      <p><b>Activo:</b> {orden.activoId}</p>
      <p><b>Estado:</b> {orden.estado}</p>
      <p><b>Prioridad:</b> {orden.prioridad}</p>
      <p><b>Descripción:</b> {orden.descripcion}</p>

      {canAssign && (
        <div>
          <h4>Asignar técnico</h4>
          <select value={selTec} onChange={e=>setSelTec(e.target.value)}>
            <option value="">-- seleccionar --</option>
            {tecnicos.map(t=> <option key={t.id} value={t.id}>{t.nombre}</option>)}
          </select>
          <button onClick={doAssign}>Asignar</button>
        </div>
      )}

      {canResolve && <button onClick={doResolve}>Marcar como resuelta</button>}
      {canCancel && <button onClick={doCancel}>Cancelar orden</button>}

      <button onClick={()=>navigate(-1)}>Volver</button>
    </div>
  )
}
