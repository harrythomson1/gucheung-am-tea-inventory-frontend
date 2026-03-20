import type { CreateCustomerData } from '../types/customer'
import api from './api'

export const getCustomers = async ({
  skip = 0,
  limit = 20,
  search,
}: {
  skip?: number
  limit?: number
  search?: string
} = {}) => {
  const params = new URLSearchParams()
  params.append('skip', String(skip))
  params.append('limit', String(limit))
  if (search) params.append('search', search)
  const response = await api.get(`/customers?${params.toString()}`)
  return response.data
}

export const createCustomer = async (customerData: CreateCustomerData) => {
  const response = await api.post('/customers', customerData)
  return response.data
}
