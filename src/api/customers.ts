import type { CreateCustomerData, UpdateCustomerData } from '../types/customer'
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

export const getCustomerWithId = async (customerId: number) => {
  const response = await api.get(`/customers/${customerId}`)
  return response.data
}

export const getTransactionsWithCustomerId = async (customerId: number) => {
  const response = await api.get(`customers/${customerId}/transactions`)
  return response.data
}

export const updateCustomer = async (id: number, data: UpdateCustomerData) => {
  const response = await api.patch(`/customers/${id}`, data)
  return response.data
}
