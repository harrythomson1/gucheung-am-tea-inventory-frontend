export type Customer = {
  id: number
  name: string
  city: string
  address?: string
  phone?: string
  notes?: string
}

export type CreateCustomerData = {
  name: string
  city: string
  address?: string
  phone?: string
  note?: string
}
