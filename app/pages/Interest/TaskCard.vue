<script setup lang="ts">
const { t } = useI18n()
import confetti from "canvas-confetti";
import checked from '~/assets/icon/checked.svg'
import unchecked from '~/assets/icon/unchecked.svg'

let totalDays = 30
let day = $ref(12)
let consecutiveDays = $ref(12)
let isCheckedToday = $ref(false)
let remainingTime = $ref('07:32:15')


const progress = computed(() => Math.round((day / totalDays) * 100))

const onCheckIn = () => {
  if (isCheckedToday) return
  isCheckedToday = true
  consecutiveDays += 1
  day = Math.min(day + 1, totalDays)
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  });
}

let loading = $ref(true)

setTimeout(() => {
  loading = false
}, 1000)

</script>

<template>
  <van-skeleton :loading="loading" animated class=" !px-0">
    <template #template>
      <div class="w-full rounded-xl bg-white border border-[#f0f0f0] p-4 shadow-sm space-y-3">
        <div class="flex items-center justify-between">
          <div>
            <div class="h-3 w-24 bg-[#f2f3f5] rounded" />
            <div class="h-3 w-20 bg-[#f2f3f5] rounded mt-2" />
          </div>
          <div class="h-6 w-16 bg-[#f2f3f5] rounded" />
        </div>
        <div class="h-3 w-full bg-[#f2f3f5] rounded" />
        <div class="flex items-center justify-between">
          <div class="h-3 w-28 bg-[#f2f3f5] rounded" />
          <div class="h-3 w-20 bg-[#f2f3f5] rounded" />
        </div>
        <div class="h-10 w-full bg-[#f2f3f5] rounded-md" />
      </div>
    </template>

    <div class="rounded-xl bg-white border border-[#f0f0f0] p-4 shadow-sm space-y-3">
      <div class="flex items-center justify-between">
        <div>
          <div class="text-sm text-gray-700">{{ t('dayProgress', { day, total: totalDays }) }}</div>
          <div class="text-xs text-gray-500">{{ t('remaining', { time: remainingTime }) }}</div>
        </div>
        <div>
          <img :src="isCheckedToday ? checked : unchecked" alt="" class="w-6 h-6">
        </div>
      </div>

      <van-progress :percentage="progress" stroke-width="10" track-color="#f0f2f5" color="linear-gradient(to right, #3fecff, #6149f6)" />

      <div class="flex items-center justify-between">
        <div class="text-xs text-gray-500">{{ t('streak', { days: consecutiveDays }) }}</div>
        <div class="text-xs text-gray-500">{{ t('completion', { percent: progress }) }}</div>
      </div>

      <van-button block type="primary" :disabled="isCheckedToday" @click="onCheckIn">
        {{ t(isCheckedToday ? 'btnComeBackTomorrow' : 'btnCheckin') }}
      </van-button>
    </div>
  </van-skeleton>
</template>

<i18n lang="json">{
  "en-US": {
    "dayProgress": "Day {day}/{total}",
    "remaining": "Remaining {time}",
    "streak": "Checked in for {days} consecutive days",
    "completion": "Completion {percent}%",
    "btnComeBackTomorrow": "Come back tomorrow",
    "btnCheckin": "Check in today"
  },
  "zh-TW": {
    "dayProgress": "第 {day}/{total} 天",
    "remaining": "剩餘 {time}",
    "streak": "已連續打卡 {days} 天",
    "completion": "完成度 {percent}%",
    "btnComeBackTomorrow": "明日再來",
    "btnCheckin": "今日打卡"
  },
  "ja-JP": {
    "dayProgress": "{day}/{total} 日目",
    "remaining": "残り {time}",
    "streak": "{days}日連続チェックイン",
    "completion": "達成度 {percent}%",
    "btnComeBackTomorrow": "また明日",
    "btnCheckin": "今日チェックイン"
  },
  "ko-KR": {
    "dayProgress": "{day}/{total}일차",
    "remaining": "남은 {time}",
    "streak": "{days}일 연속 출석",
    "completion": "달성도 {percent}%",
    "btnComeBackTomorrow": "내일 다시 오기",
    "btnCheckin": "오늘 체크인"
  }
}</i18n>
