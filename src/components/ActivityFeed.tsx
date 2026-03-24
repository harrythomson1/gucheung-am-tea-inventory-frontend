import { useEffect, useState } from 'react'
import { getActivityFeed, getCSVExport } from '../api/transaction'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import type { Tea } from '../types/tea'
import { getTeas } from '../api/tea'
import { TEA_NAMES, t } from '../constants/translations'
import type { ActivityFeedType } from '../types/transaction'
import { timeAgo } from '../utils/time'
import { Download, TrendingUp, TrendingDown } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

type ActivityFeedTypes = {
  teaId?: string
}

export function ActivityFeed({ teaId }: ActivityFeedTypes) {
  const { isAdmin } = useAuth()
  const [feedData, setFeedData] = useState<ActivityFeedType[]>([])
  const [showExportModal, setShowExportModal] = useState(false)
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [transactionType, setTransactionType] = useState<string>('')
  const [teas, setTeas] = useState<Tea[]>([])
  const [tea, setTea] = useState<number | ''>('')

  useEffect(() => {
    getActivityFeed(teaId).then((response) => {
      setFeedData(response)
    })
    getTeas().then((response) => {
      setTeas(response)
    })
  }, [teaId])

  const handleExport = async () => {
    const params = new URLSearchParams()
    if (startDate) params.append('start_date', startDate.toISOString())
    if (endDate) params.append('end_date', endDate.toISOString())
    if (transactionType) params.append('transaction_type', transactionType)
    if (tea) {
      const teaName = teas.find((t) => t.id === tea)?.name
      if (teaName) params.append('tea_name', teaName)
    }
    const response = await getCSVExport(params)
    const url = window.URL.createObjectURL(new Blob([response]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'transactions.csv')
    document.body.appendChild(link)
    link.click()
    link.remove()
    setShowExportModal(false)
  }

  return (
    <>
      {isAdmin && (
        <button
          onClick={() => setShowExportModal(true)}
          className="btn btn-secondary my-2"
        >
          <Download size={14} />
          {t('export')}
        </button>
      )}

      {showExportModal && (
        <div
          style={{ minHeight: '100vh' }}
          className="fixed inset-0 bg-black/50 flex items-end justify-center z-50"
        >
          <div className="bg-[#f2f2e1] w-full rounded-t-2xl p-6 animate-slide-up">
            <h2 className="text-sm font-medium text-[#2a5034] mb-4">
              {t('exportTransactions')}
            </h2>

            <div className="flex flex-col gap-2 mb-4">
              <DatePicker
                selected={startDate}
                onChange={(date: Date | null) => setStartDate(date)}
                placeholderText={t('startDate')}
                className="input-base"
              />
              <DatePicker
                selected={endDate}
                onChange={(date: Date | null) => setEndDate(date)}
                placeholderText={t('endDate')}
                className="input-base"
              />
              <div className="relative">
                <select
                  value={transactionType}
                  onChange={(e) => setTransactionType(e.target.value)}
                  className="input-base appearance-none pr-8"
                >
                  <option value="">{t('transactionSelect')}</option>
                  <option value="harvest">{t('harvest')}</option>
                  <option value="sale">{t('sale')}</option>
                  <option value="donation">{t('donation')}</option>
                  <option value="ceremony">{t('ceremony')}</option>
                  <option value="damaged">{t('damaged')}</option>
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#2a5034] text-xs">
                  ▼
                </span>
              </div>
              <div className="relative">
                <select
                  value={tea}
                  onChange={(e) =>
                    setTea(e.target.value ? Number(e.target.value) : '')
                  }
                  className="input-base appearance-none pr-8"
                >
                  <option value="">{t('allOptions')}</option>
                  {teas.map((tea_data) => (
                    <option key={tea_data.id} value={tea_data.id}>
                      {tea_data.name}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#2a5034] text-xs">
                  ▼
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowExportModal(false)}
                className="btn-secondary flex-1"
              >
                {t('cancel')}
              </button>
              <button onClick={handleExport} className="btn-primary flex-1">
                <Download size={14} />
                {t('download')}
              </button>
            </div>
          </div>
        </div>
      )}

      {feedData.map((feed) => (
        <div
          key={`${feed.tea_name}-${feed.created_at}`}
          className="card px-4 py-3 mb-2"
        >
          <div
            className={`flex items-center gap-1 font-medium text-sm mb-1 ${feed.quantity_change > 0 ? 'text-stock-add' : 'text-stock-remove'}`}
          >
            {feed.quantity_change > 0 ? (
              <TrendingUp size={16} />
            ) : (
              <TrendingDown size={16} />
            )}
            {Math.abs(feed.quantity_change)}{' '}
            {TEA_NAMES[feed.tea_name as keyof typeof TEA_NAMES] ??
              feed.tea_name}
          </div>
          <div className="text-sm text-gray-600">
            {t(feed.packaging) ?? feed.packaging} · {feed.weight_grams}g ·{' '}
            {t(feed.flush) ?? feed.flush} · {feed.harvest_year}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {t(feed.transaction_type) ?? feed.transaction_type} ·{' '}
            {feed.performed_by_name} · {timeAgo(feed.created_at)}
          </div>
        </div>
      ))}
    </>
  )
}
