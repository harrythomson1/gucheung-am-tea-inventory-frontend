import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { t } from '../constants/translations'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl mb-4">🍃</p>
      <h1 className="text-xl font-medium text-[#2a5034] mb-2">
        {t('notFound')}
      </h1>
      <p className="text-sm text-gray-400 mb-8">{t('notFoundMessage')}</p>
      <button
        onClick={() => navigate('/')}
        className="btn-primary flex items-center gap-1"
      >
        <ChevronLeft size={16} />
        {t('dashboard')}
      </button>
    </div>
  )
}
