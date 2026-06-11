const TOKEN_KEY = 'mantenimiento_token'

export const setToken = (t) => localStorage.setItem(TOKEN_KEY, t)
export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const logout = () => localStorage.removeItem(TOKEN_KEY)
export const isAuthenticated = () => !!getToken()
