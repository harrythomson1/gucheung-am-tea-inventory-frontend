import { useEffect, useState } from 'react'
import { getActivityFeed } from '../api/transaction'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

export type ActivityFeedType = {
  quantity_change: number
  transaction_type: string
  performed_by_name: string
  buyer_name?: string
  sales_channel?: string
  notes?: string
  packaging: string
  flush: string
  harvest_year: number
  weight_grams: number
  tea_name: string
  created_at: string
}

function timeAgo(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 60) return `${minutes} minutes ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hours ago`
  const days = Math.floor(hours / 24)
  return `${days} days ago`
}

export function ActivityFeed() {
  const [feedData, setFeedData] = useState<ActivityFeedType[]>([])
  const [showExportModal, setShowExportModal] = useState(false)
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  useEffect(() => {
    getActivityFeed().then((response) => {
      setFeedData(response)
    })
  }, [])

  const handleExport = () => console.log('button pressed')

  return (
    <>
      <div>
        <button
          onClick={() => setShowExportModal(true)}
          className="cursor-pointer px-4 py-2 m-1 rounded bg-gray-200"
        >
          Export
        </button>
        {showExportModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-80">
              <h2>Export Transactions</h2>
              <DatePicker
                selected={startDate}
                onChange={(date: Date | null) => setStartDate(date)}
                placeholderText="Start date"
              />
              <DatePicker
                selected={endDate}
                onChange={(date: Date | null) => setEndDate(date)}
                placeholderText="End date"
              />
              <button onClick={() => setShowExportModal(false)}>Cancel</button>
              <button onClick={handleExport}>Download</button>
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
            {feed.quantity_change} {feed.tea_name}
          </div>
          <div className="text-sm text-gray-600">
            {feed.packaging} · {feed.weight_grams}g · {feed.flush} flush ·{' '}
            {feed.harvest_year}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {feed.transaction_type} · {feed.performed_by_name} ·{' '}
            {timeAgo(feed.created_at)}
          </div>
        </div>
      ))}
    </>
  )
}
