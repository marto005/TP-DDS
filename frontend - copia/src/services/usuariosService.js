import api from './api';

export const usuariosService = {
  async tecnicos() {
    const res = await api.get('/usuarios/tecnicos');
    return res.data;
  },

  async listar(params = {}) {
    const res = await api.get('/usuarios', { params });
    return res.data;
  },
};
