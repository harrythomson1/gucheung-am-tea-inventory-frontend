export type AddTransactionData = {
  transaction_type: string
  tea_id: number
  packaging: string
  flush: string
  harvest_year: number
  weight_grams: number
  quantity_change: number
  notes: string | undefined
}
