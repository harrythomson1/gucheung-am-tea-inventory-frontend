import { useState } from 'react'
import { updateCustomer } from '../api/customers'
import type { Customer } from '../types/customer'
import { t } from '../constants/translations'

type UpdateCustomerModalProps = {
  onClose: () => void
  onCustomerUpdated: () => void
  currentCustomer: Customer
}

export function UpdateCustomerModal({
  onClose,
  onCustomerUpdated,
  currentCustomer,
}: UpdateCustomerModalProps) {
  const [name, setName] = useState<string>(currentCustomer.name)
  const [city, setCity] = useState<string>(currentCustomer.city)
  const [address, setAddress] = useState<string>(currentCustomer.address ?? '')
  const [phone, setPhone] = useState<string>(currentCustomer.phone ?? '')

  const handleSubmit = async () => {
    await updateCustomer(currentCustomer.id, {
      name: name || undefined,
      city: city || undefined,
      address: address || undefined,
      phone: phone || undefined,
    })
    onCustomerUpdated()
    onClose()
  }
  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-80">
          <div>{t('editCustomerTitle')}</div>
          <div>
            <input
              value={name}
              placeholder={t('namePlaceholder')}
              onChange={(e) => setName(e.target.value)}
            ></input>
            <input
              value={city}
              placeholder={t('cityPlaceholder')}
              onChange={(e) => setCity(e.target.value)}
            ></input>
            <input
              value={address || ''}
              placeholder={t('addressPlaceholder')}
              onChange={(e) => setAddress(e.target.value)}
            ></input>
            <input
              value={phone || ''}
              placeholder={t('phonePlaceholder')}
              onChange={(e) => setPhone(e.target.value)}
            ></input>
          </div>
          <button onClick={() => handleSubmit()} type="button">
            {t('submitButton')}
          </button>
          <button onClick={() => onClose()} type="button">
            {t('cancel')}
          </button>
        </div>
      </div>
    </>
  )
}
