import { useState } from 'react'
import { addTea } from '../api/tea'

type AddTeaModalType = {
  onTeaAdded: () => void
}

export default function AddTeaModal({ onTeaAdded }: AddTeaModalType) {
  const [teaName, setTeaName] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!teaName.trim()) {
      setError('차 이름을 입력해주세요')
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
        placeholder="차 이름"
      ></input>
      <button onClick={handleSubmit}>차 추가</button>
      {error && <span>{error}</span>}
    </div>
  )
}
