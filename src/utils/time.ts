import { t } from '../constants/translations'

export function timeAgo(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 60) return `${minutes}${t('minutesAgo')}`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}${t('hoursAgo')}`
  const days = Math.floor(hours / 24)
  return `${days}${t('daysAgo')}`
}
