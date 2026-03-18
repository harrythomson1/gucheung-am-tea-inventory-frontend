import { useState } from 'react'
import { addTea } from '../api/tea'
import { useNavigate } from 'react-router-dom'

export default function AddTeaForm() {
  const [teaName, setTeaName] = useState<string>('')
  const navigate = useNavigate()

  const handleSubmit = async () => {
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
    </div>
  )
}
