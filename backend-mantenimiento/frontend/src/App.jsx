import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Nav from './components/Nav'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Activos from './pages/Activos'
import Ordenes from './pages/Ordenes'
import OrdenForm from './pages/OrdenForm'
import OrdenDetail from './pages/OrdenDetail'
import { isAuthenticated } from './auth'

const Private = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />
}

export default function App() {
  return (
    <div>
      <Nav />
      <main className="container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Private><Dashboard /></Private>} />
          <Route path="/activos" element={<Private><Activos /></Private>} />
          <Route path="/ordenes" element={<Private><Ordenes /></Private>} />
          <Route path="/ordenes/nueva" element={<Private><OrdenForm /></Private>} />
          <Route path="/ordenes/:id" element={<Private><OrdenDetail /></Private>} />
        </Routes>
      </main>
    </div>
  )
}
