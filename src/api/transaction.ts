import api from './api'
import type {
  AddTransactionData,
  RemoveTransactionData,
} from '../types/transaction'

export const postHarvestTransaction = async (
  transaction_data: AddTransactionData
) => {
  const response = await api.post('/transactions', transaction_data)
  return response.data
}

export const postRemovalTransaction = async (
  transaction_data: RemoveTransactionData
) => {
  const response = await api.post('/transactions', transaction_data)
  return response.data
}

export const getActivityFeed = async (tea_id?: string) => {
  const response = await api.get('/transactions', { params: { tea_id } })
  return response.data
}

export const getCSVExport = async (params: URLSearchParams) => {
  const response = await api.get(`/transactions/export?${params.toString()}`, {
    responseType: 'blob',
  })
  return response.data
}
