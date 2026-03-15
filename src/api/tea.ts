import api from './api'

export const getTeas = async () => {
  const response = await api.get('/teas')
  return response.data
}

export const getTeaStock = async (teaId: number) => {
  const response = await api.get(`/teas/${teaId}/stock`)
  return response.data
}
