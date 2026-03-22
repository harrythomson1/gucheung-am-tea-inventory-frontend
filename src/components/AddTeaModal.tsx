import { useState } from 'react'
import { addTea } from '../api/tea'
import { t } from '../constants/translations'

type AddTeaModalType = {
  onTeaAdded: () => void
}

export default function AddTeaModal({ onTeaAdded }: AddTeaModalType) {
  const [teaName, setTeaName] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!teaName.trim()) {
      setError(t('teaNameRequired'))
      return
    }
    setError(null)
    await addTea(teaName)
    onTeaAdded()
  }

  return (
    <div>
      <input
        value={teaName}
        onChange={(e) => setTeaName(e.target.value)}
        placeholder={t('teaNamePlaceolder')}
      ></input>
      <button onClick={handleSubmit}>{t('addTeaButton')}</button>
      {error && <span>{error}</span>}
    </div>
  )
}
