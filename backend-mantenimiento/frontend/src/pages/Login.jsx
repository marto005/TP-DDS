import React, { useState } from 'react'
import api from '../api'
import { setToken } from '../auth'
import { useNavigate } from 'react-router-dom'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState(null)
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    try{
      const { data } = await api.post('/auth/login', { email, password })
      setToken(data.token)
      navigate('/')
    }catch(e){
      setErr(e.response?.data?.error || e.response?.data?.message || 'Error en login')
    }
  }

  return (
    <div className="auth-box">
      <h2>Ingresar</h2>
      {err && <div className="error">{err}</div>}
      <form onSubmit={submit}>
        <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button type="submit">Entrar</button>
      </form>
    </div>
  )
}
