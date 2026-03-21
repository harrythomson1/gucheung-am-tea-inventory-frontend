import { useEffect, useState } from 'react'
import { getActivityFeed, getCSVExport } from '../api/transaction'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import type { Tea } from '../types/tea'
import { getTeas } from '../api/tea'
import {
  BUTTON_LABELS,
  FLUSH_LABELS,
  FORM_LABELS,
  PACKAGING_LABELS,
  TEA_NAMES,
  TRANSACTION_TYPE_LABELS,
} from '../constants/transalations'
import type { ActivityFeedType } from '../types/transaction'

function timeAgo(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 60) return `${minutes}분 전`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}시간 전`
  const days = Math.floor(hours / 24)
  return `${days}일 전`
}

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
          className="cursor-pointer px-4 py-2 m-1 rounded bg-gray-200"
        >
          {BUTTON_LABELS.export}
        </button>
        {showExportModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-80">
              <h2>{FORM_LABELS.exportTransactions}</h2>
              <DatePicker
                selected={startDate}
                onChange={(date: Date | null) => setStartDate(date)}
                placeholderText={FORM_LABELS.startDate}
              />
              <DatePicker
                selected={endDate}
                onChange={(date: Date | null) => setEndDate(date)}
                placeholderText={FORM_LABELS.endDate}
              />
              <div>
                <select
                  value={transactionType}
                  onChange={(e) => setTransactionType(e.target.value)}
                >
                  <option value="">{FORM_LABELS.transactionSelect}</option>
                  <option value="harvest">
                    {TRANSACTION_TYPE_LABELS.harvest}
                  </option>
                  <option value="sale">{TRANSACTION_TYPE_LABELS.sale}</option>
                  <option value="donation">
                    {TRANSACTION_TYPE_LABELS.donation}
                  </option>
                  <option value="ceremony">
                    {TRANSACTION_TYPE_LABELS.ceremony}
                  </option>
                  <option value="damaged">
                    {TRANSACTION_TYPE_LABELS.damaged}
                  </option>
                </select>
              </div>
              <div>
                <select
                  value={tea}
                  onChange={(e) =>
                    setTea(e.target.value ? Number(e.target.value) : '')
                  }
                >
                  <option value="">{FORM_LABELS.allOptions}</option>
                  {teas.map((tea_data) => (
                    <option key={tea_data.id} value={tea_data.id}>
                      {tea_data.name}
                    </option>
                  ))}
                </select>
              </div>
              <button onClick={() => setShowExportModal(false)}>
                {FORM_LABELS.cancel}
              </button>
              <button onClick={handleExport}>{FORM_LABELS.download}</button>
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
            className={`font-bold text-lg ${feed.quantity_change > 0 ? 'text-green-600' : 'text-red-600'}`}
          >
            {feed.quantity_change > 0 ? '+' : ''}
            {feed.quantity_change}{' '}
            {`${TEA_NAMES[feed.tea_name as keyof typeof TEA_NAMES] ?? feed.tea_name}`}
          </div>
          <div className="text-sm text-gray-600">
            {PACKAGING_LABELS[
              feed.packaging as keyof typeof PACKAGING_LABELS
            ] ?? feed.packaging}{' '}
            · {feed.weight_grams}g ·{' '}
            {FLUSH_LABELS[feed.flush as keyof typeof FLUSH_LABELS] ??
              feed.flush}{' '}
            · {feed.harvest_year}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {TRANSACTION_TYPE_LABELS[
              feed.transaction_type as keyof typeof TRANSACTION_TYPE_LABELS
            ] ?? feed.transaction_type}{' '}
            · {feed.performed_by_name} · {timeAgo(feed.created_at)}
          </div>
        </div>
      ))}
    </>
  )
}
