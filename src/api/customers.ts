import api from './api'

export const searchCustomers = async (search: string) => {
  const response = await api.get(
    `/customers?search=${encodeURIComponent(search)}`
  )
  return response.data
}
