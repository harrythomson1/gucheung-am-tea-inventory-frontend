import { useState } from 'react'
import { createCustomer } from '../api/customers'
import type { Customer } from '../types/customer'
import { t } from '../constants/translations'
import { X } from 'lucide-react'

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
  const [address1, setAddress1] = useState<string>('')
  const [address2, setAddress2] = useState<string>('')
  const [postcode, setPostcode] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [notes, setNote] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError(t('nameRequired'))
      return
    }
    if (!city.trim()) {
      setError(t('cityRequired'))
      return
    }
    setError(null)
    setIsSubmitting(true)
    try {
      const customer = await createCustomer({
        name,
        city,
        address_1: address1 || undefined,
        address_2: address2 || undefined,
        postcode: postcode || undefined,
        phone: phone || undefined,
        notes: notes || undefined,
      })
      onCustomerCreated(customer)
      onClose()
    } catch {
      setError(t('customerCreateError'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      style={{ minHeight: '100vh' }}
      className="fixed inset-0 bg-black/50 flex items-end justify-center z-50"
    >
      <div className="bg-[#f2f2e1] w-full rounded-t-2xl p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-[#2a5034]">
            {t('addCustomerTitle')}
          </h2>
          <button onClick={onClose}>
            <X size={16} className="text-gray-400" />
          </button>
        </div>

        <div className="flex flex-col gap-2 mb-4">
          <input
            placeholder={t('namePlaceholder')}
            onChange={(e) => setName(e.target.value)}
            className="input-base"
          />
          <input
            placeholder={t('cityPlaceholder')}
            onChange={(e) => setCity(e.target.value)}
            className="input-base"
          />
          <input
            placeholder={t('address1Placeholder')}
            onChange={(e) => setAddress1(e.target.value)}
            className="input-base"
          />
          <input
            placeholder={t('address2Placeholder')}
            onChange={(e) => setAddress2(e.target.value)}
            className="input-base"
          />
          <input
            placeholder={t('postcodePlaceholder')}
            onChange={(e) => setPostcode(e.target.value)}
            className="input-base"
          />
          <input
            placeholder={t('phonePlaceholder')}
            onChange={(e) => setPhone(e.target.value)}
            className="input-base"
          />
          <input
            placeholder={t('notesPlaceholder')}
            onChange={(e) => setNote(e.target.value)}
            className="input-base"
          />
        </div>

        {error && <p className="text-danger text-xs mb-3">{error}</p>}

        <div className="flex gap-2">
          <button
            onClick={onClose}
            type="button"
            className="btn-secondary flex-1"
          >
            {t('cancel')}
          </button>
          <button
            onClick={handleSubmit}
            type="button"
            disabled={isSubmitting}
            className="btn-primary flex-1 disabled:opacity-50"
          >
            {t('submitButton')}
          </button>
        </div>
      </div>
    </div>
  )
}
