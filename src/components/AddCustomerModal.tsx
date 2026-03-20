import { useState } from 'react'
import { createCustomer } from '../api/customers'

type AddCustomerModalProps = {
  onClose: () => void
}

export function AddCustomerModal({ onClose }: AddCustomerModalProps) {
  const [name, setName] = useState<string>('')
  const [city, setCity] = useState<string>('')
  const [address, setAddress] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [note, setNote] = useState<string>('')

  const handleSubmit = async () => {
    await createCustomer({
      name,
      city,
      address: address || undefined,
      phone: phone || undefined,
      note: note || undefined,
    })
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
              placeholder="Note"
              onChange={(e) => setNote(e.target.value)}
            ></input>
          </div>
          <button onClick={() => handleSubmit()}>Submit</button>
        </div>
      </div>
    </>
  )
}
