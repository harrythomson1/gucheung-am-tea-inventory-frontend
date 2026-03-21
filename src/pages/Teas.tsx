import { useEffect, useState } from 'react'
import AddTeaModal from '../components/AddTeaModal'
import type { Tea } from '../types/tea'
import { getTeas } from '../api/tea'

export default function Teas() {
  const [teas, setTeas] = useState<Tea[]>([])

  useEffect(() => {
    getTeas().then((response) => {
      setTeas(response)
    })
  }, [])
  return (
    <>
      {teas.map((tea) => (
        <div key={tea.id}>{tea.name}</div>
      ))}
      <AddTeaModal />
    </>
  )
}
