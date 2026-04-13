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

export type RemoveTransactionData = {
  transaction_type: string
  tea_variant_id: number
  quantity_change: number
  sales_channel?: string
  notes?: string
  customer_id?: number
}

export type ActivityFeedType = {
  quantity_change: number
  transaction_type: string
  performed_by_name: string
  sales_channel?: string
  notes?: string
  packaging: string
  flush: string
  harvest_year: number
  weight_grams: number
  tea_name: string
  created_at: string
}

export type RecentlyRemoved = {
  tea_name: string
  harvest_year: number
  packaging: string
  flush: string
  weight_grams: number
}
