import { useState } from 'react'
import { createCustomer } from '../api/customers'
import type { Customer } from '../types/customer'

type AddCustomerModalProps = {
  onClose: () => void
  onCustomerCreated: (customer: Customer) => void
}

export function AddCustomerModal({
  onClose,
  onCustomerCreated,
}: AddCustomerModalProps) {
  const [name, setName] = useState<string>('')
  const [city, setCity] = useState<string>('')
  const [address, setAddress] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [notes, setNote] = useState<string>('')
  const [error, setError] = useState<string | null>('')

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('이름을 입력해주세요')
      return
    }
    if (!city.trim()) {
      setError('도시를 입력해주세요')
      return
    }
    setError(null)
    const customer = await createCustomer({
      name,
      city,
      address: address || undefined,
      phone: phone || undefined,
      notes: notes || undefined,
    })
    onCustomerCreated(customer)
    onClose()
  }
  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-80">
          <div>AddCustomerModal</div>
          <div>
            <input
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
            ></input>
            <input
              placeholder="City"
              onChange={(e) => setCity(e.target.value)}
            ></input>
            <input
              placeholder="Address"
              onChange={(e) => setAddress(e.target.value)}
            ></input>
            <input
              placeholder="Phone"
              onChange={(e) => setPhone(e.target.value)}
            ></input>
            <input
              placeholder="Notes"
              onChange={(e) => setNote(e.target.value)}
            ></input>
          </div>
          <button onClick={() => handleSubmit()} type="button">
            Submit
          </button>
          {error && <span className="text-red-500 text-sm">{error}</span>}
        </div>
      </div>
    </>
  )
}
