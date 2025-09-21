import { doFetch } from '@/composables/doFetch'

export const getCheckinJackpot = () => {
  return doFetch('/api/checkin/jackpot', { method: 'GET' })
}

export const getCheckinNoticeList = () => {
  return doFetch('/api/checkin/notice', { method: 'GET' })
}

export const getCheckinStatus = (jackpotId: number) => {
  return doFetch('/api/checkin/status', { method: 'GET', query: { jackpotId } })
}

export const postCheckin = (params: any) => {
  return doFetch('/api/checkin/do', { method: 'POST', body: params })
}

export const redeemMakeupCard = (params: any) => {
  return doFetch('/api/checkin/redeem', { method: 'POST', body: params })
}

export const useMakeupCard = (day: number) => {
  return doFetch('/api/checkin/use', { method: 'GET', query: { day } })
}
