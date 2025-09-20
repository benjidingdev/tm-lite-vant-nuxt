import { doFetch } from '@/composables/doFetch'

export const getCheckinNoticeList = () => {
  return doFetch('/api/checkin/notice', { method: 'GET' })
}

export const getCheckinKpi = () => {
  return doFetch('/api/checkin/kpi', { method: 'GET' })
}

export const getCheckinStatus = () => {
  return doFetch('/api/checkin/status', { method: 'GET' })
}

export const postCheckin = () => {
  return doFetch('/api/checkin/do', { method: 'GET' })
}

export const redeemMakeupCard = () => {
  return doFetch('/api/checkin/redeem', { method: 'GET' })
}

export const useMakeupCard = (day: number) => {
  return doFetch('/api/checkin/use', { method: 'GET', query: { day } })
}
