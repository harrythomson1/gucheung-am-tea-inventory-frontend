import { useEffect, useState } from 'react'
import AddTeaModal from '../components/AddTeaModal'
import type { Tea } from '../types/tea'
import { getTeas, softDeleteTea } from '../api/tea'
import { t } from '../constants/translations'
import { ChevronLeft, Leaf } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Teas() {
  const [teas, setTeas] = useState<Tea[]>([])
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    getTeas()
      .then((response) => {
        setTeas(response)
      })
      .catch((error) => console.error('Failed to fetch teas:', error))
  }, [])

  const handleDelete = (id: number) => {
    setDeletingId(id)
    softDeleteTea(id)
      .then(() => {
        setTeas(teas.filter((t) => t.id !== id))
        setDeletingId(null)
        setConfirmDeleteId(null)
      })
      .catch((error) => {
        console.error('Failed to delete tea:', error)
        setDeletingId(null)
      })
  }

  return (
    <div className="px-4 pb-28 safe-area-inset">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-1 text-sm text-[#2a5034] mt-4 mb-3"
      >
        <ChevronLeft size={16} />
        {t('dashboard')}
      </button>
      <p className="text-xs text-gray-400 uppercase tracking-wider mt-4 mb-2">
        {t('manageTeas')}
      </p>

      <div className="flex flex-col gap-2 mb-4">
        {teas.map((tea) => (
          <div
            key={tea.id}
            className={`rounded-xl border transition-colors ${
              confirmDeleteId === tea.id
                ? 'bg-red-50 border-red-200'
                : 'bg-white border-gray-200'
            }`}
          >
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Leaf
                  size={14}
                  className={
                    confirmDeleteId === tea.id
                      ? 'text-red-400'
                      : 'text-[#2a5034]'
                  }
                />
                <span
                  className={`text-sm font-medium ${
                    confirmDeleteId === tea.id
                      ? 'text-red-700'
                      : 'text-[#2a5034]'
                  }`}
                >
                  {tea.name}
                </span>
              </div>
              {confirmDeleteId !== tea.id && (
                <button
                  onClick={() => setConfirmDeleteId(tea.id)}
                  className="text-xs text-gray-400 border border-gray-200 rounded-lg px-3 py-1.5"
                >
                  {t('deleteTea')}
                </button>
              )}
            </div>

            {confirmDeleteId === tea.id && (
              <div className="px-4 pb-3">
                <p className="text-xs text-red-500 mb-2">
                  {t('deleteTeaConfirm')}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setConfirmDeleteId(null)}
                    className="flex-1 text-xs text-gray-500 border border-gray-200 rounded-lg py-2"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    onClick={() => handleDelete(tea.id)}
                    disabled={deletingId === tea.id}
                    className="flex-1 text-xs text-white bg-[#8b3a22] rounded-lg py-2 disabled:opacity-50"
                  >
                    {deletingId === tea.id
                      ? '...'
                      : t('deleteTeaConfirmButton')}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <AddTeaModal onTeaAdded={() => getTeas().then(setTeas)} />
    </div>
  )
}
