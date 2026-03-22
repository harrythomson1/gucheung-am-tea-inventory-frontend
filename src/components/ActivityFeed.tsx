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

export function ActivityFeed() {
  const [feedData, setFeedData] = useState<ActivityFeedType[]>([])
  const [showExportModal, setShowExportModal] = useState(false)
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [transactionType, setTransactionType] = useState<string>('')
  const [teas, setTeas] = useState<Tea[]>([])
  const [tea, setTea] = useState<number | ''>('')

  useEffect(() => {
    getActivityFeed().then((response) => {
      setFeedData(response)
    })
    getTeas().then((response) => {
      setTeas(response)
    })
  }, [])

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
      <div>
        <button
          onClick={() => setShowExportModal(true)}
          className="btn btn-secondary my-2"
        >
          <Download size={14} />
          {t('export')}
        </button>
        {showExportModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-80">
              <h2>{t('exportTransactions')}</h2>
              <DatePicker
                selected={startDate}
                onChange={(date: Date | null) => setStartDate(date)}
                placeholderText={t('startDate')}
              />
              <DatePicker
                selected={endDate}
                onChange={(date: Date | null) => setEndDate(date)}
                placeholderText={t('endDate')}
              />
              <div>
                <select
                  value={transactionType}
                  onChange={(e) => setTransactionType(e.target.value)}
                >
                  <option value="">{t('transactionSelect')}</option>
                  <option value="harvest">{t('harvest')}</option>
                  <option value="sale">{t('sale')}</option>
                  <option value="donation">{t('donation')}</option>
                  <option value="ceremony">{t('ceremony')}</option>
                  <option value="damaged">{t('damaged')}</option>
                </select>
              </div>
              <div>
                <select
                  value={tea}
                  onChange={(e) =>
                    setTea(e.target.value ? Number(e.target.value) : '')
                  }
                >
                  <option value="">{t('allOptions')}</option>
                  {teas.map((tea_data) => (
                    <option key={tea_data.id} value={tea_data.id}>
                      {tea_data.name}
                    </option>
                  ))}
                </select>
              </div>
              <button onClick={() => setShowExportModal(false)}>
                {t('cancel')}
              </button>
              <button onClick={handleExport}>{t('download')}</button>
            </div>
          </div>
        )}
      </div>
      {feedData.map((feed) => (
        <div
          key={`${feed.tea_name}-${feed.created_at}`}
          className="p-3 mb-2 border rounded-lg"
        >
          <div
            className={`font-bold text-lg ${feed.quantity_change > 0 ? 'text-stock-add' : 'text-stock-remove'}`}
          >
            {feed.quantity_change > 0 ? (
              <TrendingUp size={16} />
            ) : (
              <TrendingDown size={16} />
            )}
            {Math.abs(feed.quantity_change)}{' '}
            {`${TEA_NAMES[feed.tea_name as keyof typeof TEA_NAMES] ?? feed.tea_name}`}
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
