import { useState } from 'react'
import { addTea } from '../api/tea'
import { t } from '../constants/translations'

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
      onTeaAdded()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <input
        value={teaName}
        onChange={(e) => setTeaName(e.target.value)}
        placeholder={t('teaNamePlaceholder')}
      ></input>
      <button onClick={handleSubmit} disabled={isSubmitting}>
        {t('addTeaButton')}
      </button>
      {error && <span>{error}</span>}
    </div>
  )
}
