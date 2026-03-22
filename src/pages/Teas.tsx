import { useEffect, useState } from 'react'
import AddTeaModal from '../components/AddTeaModal'
import type { Tea } from '../types/tea'
import { getTeas, softDeleteTea } from '../api/tea'
import { t } from '../constants/translations'

export default function Teas() {
  const [teas, setTeas] = useState<Tea[]>([])
  const [deletingId, setDeletingId] = useState<number | null>(null)

  useEffect(() => {
    getTeas().then((response) => {
      setTeas(response)
    })
  }, [])
  return (
    <>
      {teas.map((tea) => (
        <div key={tea.id}>
          {tea.name}{' '}
          <button
            disabled={deletingId === tea.id}
            onClick={() => {
              setDeletingId(tea.id)
              softDeleteTea(tea.id).then(() => {
                setTeas(teas.filter((t) => t.id !== tea.id))
                setDeletingId(null)
              })
            }}
          >
            {t('deleteTea')}
          </button>
        </div>
      ))}
      <AddTeaModal onTeaAdded={() => getTeas().then(setTeas)} />
    </>
  )
}
