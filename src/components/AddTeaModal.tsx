import { useState } from 'react'
import { addTea } from '../api/tea'
import { t } from '../constants/translations'
import { Plus } from 'lucide-react'

type AddTeaModalType = {
  onTeaAdded: () => void
}

export default function AddTeaModal({ onTeaAdded }: AddTeaModalType) {
  const [teaName, setTeaName] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      if (!teaName.trim()) {
        setError(t('teaNameRequired'))
        return
      }
      setError(null)
      await addTea(teaName)
      setTeaName('')
      onTeaAdded()
    } catch {
      setError(t('teaAddError'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          value={teaName}
          onChange={(e) => {
            setTeaName(e.target.value)
            setError('')
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder={t('teaNamePlaceholder')}
          className="flex-1 input-base"
        />
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="btn-primary disabled:opacity-50 px-4"
        >
          <Plus size={16} />
        </button>
      </div>
      {error && <p className="text-xs text-danger px-1">{error}</p>}
    </div>
  )
}
