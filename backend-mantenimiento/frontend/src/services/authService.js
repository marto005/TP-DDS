import api from '../api'
import { setToken, getToken, logout } from '../auth'
import { parseJwt } from '../utils/jwt'

export const login = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password })
  setToken(data.token)
  return parseJwt(data.token)
}

export const currentUser = () => parseJwt(getToken())

export const logoutAndRedirect = () => { logout() }
