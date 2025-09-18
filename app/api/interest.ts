import { doFetch } from '@/composables/doFetch'

export const getInterestNoticeList = () => {
  return doFetch('/api/interest/notice', { method: 'GET' })
}
