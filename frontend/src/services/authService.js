import api from './api';

export const authService = {
  async login(email, password) {
    const res = await api.post('/auth/login', { email, password });
    return res.data; // { token, usuario }
  },

  async registrar(datos) {
    const res = await api.post('/auth/register', datos);
    return res.data;
  },
};
