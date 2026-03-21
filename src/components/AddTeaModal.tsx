import { useState } from 'react'
import { addTea } from '../api/tea'
import { useNavigate } from 'react-router-dom'

export default function AddTeaModal() {
  const [teaName, setTeaName] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!teaName.trim()) {
      setError('차 이름을 입력해주세요')
      return
    }
    setError(null)
    await addTea(teaName)
    navigate('/')
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
