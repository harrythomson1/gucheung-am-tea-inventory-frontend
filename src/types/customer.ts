export type Customer = {
  id: number
  name: string
  city: string
  address_1?: string
  address_2?: string
  postcode?: string
  phone?: string
  notes?: string
}

export type CreateCustomerData = {
  name: string
  city: string
  address_1?: string
  address_2?: string
  postcode?: string
  phone?: string
  notes?: string
}

export type UpdateCustomerData = {
  name?: string
  city?: string
  address_1?: string | null
  address_2?: string | null
  postcode?: string | null
  phone?: string | null
  notes?: string | null
}
