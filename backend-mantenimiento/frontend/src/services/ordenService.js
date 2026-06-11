import api from '../api'
export const fetchOrdenes = () => api.get('/ordenes').then(r=>r.data)
export const fetchOrden = (id) => api.get(`/ordenes/${id}`).then(r=>r.data)
export const createOrden = (payload) => api.post('/ordenes', payload).then(r=>r.data)
export const asignarTecnico = (id, tecnicoId) => api.patch(`/ordenes/${id}/asignar`, { tecnicoId }).then(r=>r.data)
export const cancelarOrden = (id) => api.patch(`/ordenes/${id}/cancelar`).then(r=>r.data)
export const resolverOrden = (id) => api.patch(`/ordenes/${id}/resolver`).then(r=>r.data)
export const resumen = () => api.get('/ordenes/resumen').then(r=>r.data)
