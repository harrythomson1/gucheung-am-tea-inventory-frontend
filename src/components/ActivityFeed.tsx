import { useEffect, useState } from 'react'
import { getActivityFeed } from '../api/transaction'

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

export function ActivityFeed() {
  const [feedData, setFeedData] = useState<ActivityFeedType[]>([])

  useEffect(() => {
    getActivityFeed().then((response) => {
      setFeedData(response)
    })
  }, [])

  return (
    <>
      {feedData.map((feed) => (
        <div key={`${feed.tea_name}-${feed.created_at}`}>
          {feed.performed_by_name} {feed.tea_name} {feed.quantity_change}{' '}
          {feed.weight_grams}g's
        </div>
      ))}
    </>
  )
}
