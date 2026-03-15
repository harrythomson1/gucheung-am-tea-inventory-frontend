import api from './api'

export const getTeas = async () => {
  const response = await api.get('/teas')
  return response.data
}
