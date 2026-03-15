import api from './api'
import type { AddTransactionData } from '../types/transaction'

export const postTransaction = async (transaction_data: AddTransactionData) => {
  const response = await api.post('/transactions', transaction_data)
  return response.data
}
