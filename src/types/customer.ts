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
  notes?: string
}

export type UpdateCustomerData = {
  name?: string
  city?: string
  address?: string | null
  phone?: string | null
  notes?: string | null
}
