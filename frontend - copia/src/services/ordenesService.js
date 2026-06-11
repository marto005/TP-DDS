import api from './api';

export const ordenesService = {
  async listar(params = {}) {
    const res = await api.get('/ordenes', { params });
    return res.data; // { ordenes, total, pagina, totalPaginas }
  },

  async obtener(id) {
    const res = await api.get(`/ordenes/${id}`);
    return res.data;
  },

  async historial(id) {
    const res = await api.get(`/ordenes/${id}/historial`);
    return res.data;
  },

  async resumen() {
    const res = await api.get('/ordenes/resumen');
    return res.data;
  },

  async crear(datos) {
    const res = await api.post('/ordenes', datos);
    return res.data;
  },

  async editar(id, datos) {
    const res = await api.put(`/ordenes/${id}`, datos);
    return res.data;
  },

  async cancelar(id) {
    const res = await api.patch(`/ordenes/${id}/cancelar`);
    return res.data;
  },

  async asignar(id, tecnicoId) {
    const res = await api.patch(`/ordenes/${id}/asignar`, { tecnicoId });
    return res.data;
  },

  async resolver(id) {
    const res = await api.patch(`/ordenes/${id}/resolver`);
    return res.data;
  },
};
