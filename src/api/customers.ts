import type { CreateCustomerData } from '../types/customer'
import api from './api'

export const searchCustomers = async (search: string) => {
  const response = await api.get(
    `/customers?search=${encodeURIComponent(search)}`
  )
  return response.data
}

export const createCustomer = async (customerData: CreateCustomerData) => {
  const response = await api.post('/customers', customerData)
  return response.data
}
