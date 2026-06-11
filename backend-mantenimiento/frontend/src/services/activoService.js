import api from '../api'
export const fetchActivos = () => api.get('/activos').then(r=>r.data)
