<script setup lang="ts">
import { get } from 'lodash'
import { checkinRank } from '~/api/checkin'

const { t } = useI18n()
const { userId, jackpot } = $(checkinStore())

let leaderboard = $ref([
  { name: 'Alice', invites: 23, points: 460, avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=alice' },
  { name: 'Bob', invites: 18, points: 360, avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=bob' },
  { name: 'Chloe', invites: 16, points: 320, avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=chloe' },
  { name: 'Chloe', invites: 16, points: 320, avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=chloe' },
  { name: 'Chloe', invites: 16, points: 320, avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=chloe' },
  { name: 'Chloe', invites: 16, points: 320, avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=chloe' },
])

let streakboard = $ref([])

const avatarUrl = 'https://api.dicebear.com/7.x/identicon/svg?seed='
const avatarSeeds = ['cara','daniel','evan','chloe','alice','bob']

let loading = $ref(true)
setTimeout(() => {
  loading = false
}, 1000)

import No1 from '~/assets/icon/No1.svg'
import No2 from '~/assets/icon/No2.svg'
import No3 from '~/assets/icon/No3.svg'

const getRankBgClass = (idx: number) => {
  if (idx === 0) return 'bg-amber-50 border-amber-200'
  if (idx === 1) return 'bg-gray-50 border-gray-200'
  if (idx === 2) return 'bg-orange-50 border-orange-200'
  return 'bg-[#fafafa] border-[#f2f3f5]'
}

const getCrown = (idx: number) => {
  if (idx === 0) return No1
  if (idx === 1) return No2
  if (idx === 2) return No3
  return null
}

const handleTabChange = (tab: string) => {
  if (tab === t('tabs.invite')) {
    leaderboard = [...leaderboard]
  } else {
    getStreak(jackpot.id)
  }
}

const getStreak = async (jackpotId: number) => {
  const res = await checkinRank(jackpotId)
  if (res.code === 200) {
    streakboard = res.data
  }
}
</script>

<template>
  <van-skeleton :loading="loading" animated class="!px-0">
    <template #template>
      <div class="w-full rounded-xl bg-white border border-[#f0f0f0] p-4 shadow-sm">
        <!-- tabs header skeleton -->
        <div class="flex items-center gap-3">
          <div class="h-7 w-16 bg-[#f2f3f5] rounded-full" />
          <div class="h-7 w-16 bg-[#f2f3f5] rounded-full" />
        </div>
        <!-- list skeleton -->
        <div class="space-y-2 mt-3">
          <div v-for="i in 3" :key="i" class="flex items-center justify-between bg-[#fafafa] rounded-lg p-3 border border-[#f2f3f5]">
            <div class="flex items-center gap-3">
              <div class="h-5 w-5 bg-[#f2f3f5] rounded" />
              <div class="h-9 w-9 bg-[#f2f3f5] rounded-full" />
              <div class="space-y-2">
                <div class="h-3 w-24 bg-[#f2f3f5] rounded" />
                <div class="h-3 w-20 bg-[#f2f3f5] rounded" />
              </div>
            </div>
            <div class="h-6 w-14 bg-[#f2f3f5] rounded" />
          </div>
        </div>
      </div>
    </template>

    <div class=" rounded-xl bg-white border border-[#f0f0f0] p-4 shadow-sm">
      <van-tabs
        background="#ffffff"
        title-active-color="#111111"
        title-inactive-color="#9ca3af"
        color="#1989FA"
        swipeable
        @change="handleTabChange"
      >
        <van-tab :title="t('tabs.invite')">
          <div class="space-y-2 mt-2 h-[300px] overflow-y-auto scrollbar-hidden">
            <div
              v-for="(item, idx) in leaderboard"
              :key="idx"
              class="flex items-center justify-between rounded-lg p-3 border"
              :class="getRankBgClass(idx)"
            >
              <div class="flex items-center gap-3">
                <div class="relative inline-flex items-center justify-center w-8 h-8 shrink-0">
                  <van-image :src="item.avatar" width="30" height="30" round />
                  <img
                    v-if="getCrown(idx)"
                    :src="getCrown(idx)!"
                    alt="crown"
                    class="pointer-events-none absolute -top-1 left-1 w-4 h-4 -rotate-45 origin-bottom-left"
                  />
                </div>
                <div class="text-sm">
                  <div class="text-gray-800">{{ item.name }}</div>
                  <div class="text-xs text-gray-500">{{ t('invitedN', { count: item.invites }) }}</div>
                </div>
              </div>
              <van-tag type="primary">+{{ item.points }}</van-tag>
            </div>
          </div>
        </van-tab>

        <van-tab :title="t('tabs.streak')">
          <div class="space-y-2 mt-2 h-[300px] overflow-y-auto scrollbar-hidden">
            <div
              v-for="(item, idx) in streakboard"
              :key="idx"
              class="flex items-center justify-between rounded-lg p-3 border"
              :class="getRankBgClass(idx)"
            >
              <div class="flex items-center gap-3">
                <div class="relative inline-flex items-center justify-center w-8 h-8 shrink-0">
                  <van-image :src="avatarUrl + (idx < 3 ? avatarSeeds[idx] : avatarSeeds[3])" width="30" height="30" round />
                  <img
                    v-if="getCrown(idx)"
                    :src="getCrown(idx)!"
                    alt="crown"
                    class="pointer-events-none absolute -top-1 left-1 w-4 h-4 -rotate-45 origin-bottom-left"
                  />
                </div>
                <div class="text-sm">
                  <div class="text-gray-800">{{ item.userId.slice(0, 6) }}...{{ item.userId.slice(-4) }}</div>
                  <div class="text-xs text-gray-500">{{ t('streakDays', { days: item.cnt }) }}</div>
                </div>
              </div>
              <van-tag type="success">{{ t('daysUnit', { days: item.cnt }) }}</van-tag>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </van-skeleton>
</template>

<i18n lang="json">{
  "en-US": {
    "tabs": {
      "invite": "Invite Ranking",
      "streak": "Streak Ranking"
    },
    "invitedN": "Invited {count} people",
    "streakDays": "Check in {days} days",
    "daysUnit": "{days} days"
  },
  "zh-TW": {
    "tabs": {
      "invite": "邀請榜",
      "streak": "打卡榜"
    },
    "invitedN": "邀請 {count} 人",
    "streakDays": "打卡 {days} 天",
    "daysUnit": "{days} 天"
  },
  "ja-JP": {
    "tabs": {
      "invite": "招待ランキング",
      "streak": "継続ランキング"
    },
    "invitedN": "招待 {count} 人",
    "streakDays": "チェックイン {days} 日",
    "daysUnit": "{days} 日"
  },
  "ko-KR": {
    "tabs": {
      "invite": "초대 랭킹",
      "streak": "연속 랭킹"
    },
    "invitedN": "초대 {count}명",
    "streakDays": "출석체크 {days}일",
    "daysUnit": "{days}일"
  }
}</i18n>
