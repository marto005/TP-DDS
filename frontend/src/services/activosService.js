import api from './api';

export const activosService = {
  async listar(params = {}) {
    const res = await api.get('/activos', { params });
    return res.data;
  },

  async obtener(id) {
    const res = await api.get(`/activos/${id}`);
    return res.data;
  },
};
