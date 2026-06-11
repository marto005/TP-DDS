import React, { useEffect, useState } from 'react'
import api from '../api'
import { useNavigate } from 'react-router-dom'

export default function OrdenForm(){
  const [activos, setActivos] = useState([])
  const [activoId, setActivoId] = useState('')
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [prioridad, setPrioridad] = useState('media')
  const navigate = useNavigate()

  useEffect(()=>{
    api.get('/activos').then(r=>setActivos(r.data)).catch(()=>setActivos([]))
  },[])

  const submit = async (e) => {
    e.preventDefault()
    try{
      await api.post('/ordenes', { activoId, titulo, descripcion, prioridad })
      navigate('/ordenes')
    }catch(e){
      alert(e.response?.data?.message || 'Error creando orden')
    }
  }

  return (
    <div>
      <h2>Nueva orden</h2>
      <form onSubmit={submit} className="form">
        <select value={activoId} onChange={e=>setActivoId(e.target.value)} required>
          <option value="">-- Seleccionar activo --</option>
          {activos.map(a=>(<option key={a.id} value={a.id}>{a.codigo} - {a.nombre}</option>))}
        </select>
        <input placeholder="Título" value={titulo} onChange={e=>setTitulo(e.target.value)} required />
        <textarea placeholder="Descripción" value={descripcion} onChange={e=>setDescripcion(e.target.value)} />
        <select value={prioridad} onChange={e=>setPrioridad(e.target.value)}>
          <option value="baja">baja</option>
          <option value="media">media</option>
          <option value="alta">alta</option>
          <option value="urgente">urgente</option>
        </select>
        <button type="submit">Crear</button>
      </form>
    </div>
  )
}
