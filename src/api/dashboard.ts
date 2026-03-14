import api from './api'

export const getDashboard = async () => {
  const response = await api.get('/dashboard')
  console.log(response.data)
  return response.data
}
