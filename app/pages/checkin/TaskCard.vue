<script setup lang="ts">
const { t } = useI18n()
import confetti from "canvas-confetti";
import { showConfirmDialog, showToast } from 'vant'
import { getCheckinStatus, postCheckin, redeemMakeupCard, useMakeupCard } from '~/api/checkin'

let isLoading = $ref(true)
let isActing = $ref(false)

let checkinStatus = $ref(null as null | {
  totalDays: number
  checkedDays: number[]
  consecutiveDays: number
  isCheckin: boolean
  availablePoints: number
  makeupCardCount: number
  makeupCardCost: number
})

// 加载打卡状态
const  fetchStatus = async () => {
  try {
    isLoading = true
    const res = await getCheckinStatus()
    const data = res?.data || null
    if (res?.code === 0 && data) {
      checkinStatus = {
        totalDays: data.totalDays ?? 30,
        checkedDays: Array.isArray(data.checkedDays) ? data.checkedDays : [],
        consecutiveDays: data.consecutiveDays ?? 0,
        isCheckin: !!data.isCheckin,
        availablePoints: data.availablePoints ?? 0,
        makeupCardCount: data.makeupCardCount ?? 0,
        makeupCardCost: data.makeupCardCost ?? 1200,
      }
    }
  }  finally {
    isLoading = false
  }
}

onMounted(fetchStatus)

const derived = $computed(() => {
  const totalDays = checkinStatus?.totalDays ?? 30
  const checkedDays = Array.isArray(checkinStatus?.checkedDays) ? checkinStatus!.checkedDays : []
  const consecutiveDays = checkinStatus?.consecutiveDays ?? 0
  const isCheckin = !!checkinStatus?.isCheckin
  const availablePoints = checkinStatus?.availablePoints ?? 0
  const makeupCardCount = checkinStatus?.makeupCardCount ?? 0
  const makeupCardCost = checkinStatus?.makeupCardCost ?? 1200

  const lastChecked = checkedDays.length ? Math.max(...checkedDays) : 0
  const nextDay = Math.min(lastChecked + 1, totalDays)
  const todayIndex = isCheckin ? 0 : nextDay

  const set = new Set(checkedDays)
  const missedDays: number[] = []
  for (let d = 1; d < nextDay; d++) {
    if (!set.has(d)) missedDays.push(d)
  }

  const progress = totalDays ? Math.round((checkedDays.length / totalDays) * 100) : 0

  return {
    totalDays,
    checkedDays,
    consecutiveDays,
    isCheckin,
    availablePoints,
    makeupCardCount,
    makeupCardCost,
    todayIndex,
    missedDays,
    progress,
  }
})

// 漏签日点击处理：优先使用已有补签卡，否则弹窗购买并自动补签
const onMissedDayClick = async (day: number) => {
  if (isActing) return

  if (derived.makeupCardCount > 0) {
    try {
      await showConfirmDialog({ message: t('useMakeupConfirm', { day }) })
    } catch { return }

    try {
      isActing = true
      const res = await useMakeupCard(day)
      if (res?.data === true) {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } })
        showToast(t('useSuccess'))
        await fetchStatus()
      } else {
        showToast(res?.message || t('networkError'))
      }
    } catch {
      showToast(t('networkError'))
    } finally {
      isActing = false
    }
    return
  }

  try {
    await showConfirmDialog({ message: t('purchaseConfirm', { cost: derived.makeupCardCost }) })
  } catch { return }

  try {
    isActing = true
    const buyRes = await redeemMakeupCard()
    if (buyRes?.data === true) {
      showToast(t('purchaseSuccess'))
      const useRes = await useMakeupCard(day)
      if (useRes?.data === true) {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } })
        showToast(t('useSuccess'))
        await fetchStatus()
      } else {
        showToast(useRes?.message || t('networkError'))
      }
    } else {
      showToast(buyRes?.message || t('insufficientPoints'))
    }
  } finally {
    isActing = false
  }
}

// 仅购买补签卡
const onRedeemMakeupCard = async () => {
  if (isActing) return
  try {
    await showConfirmDialog({ message: t('purchaseConfirm', { cost: derived.makeupCardCost }) })
  } catch { return }

  try {
    isActing = true
    const res = await redeemMakeupCard()
    if (res?.code === 0 && res?.data === true) {
      showToast(t('purchaseSuccess'))
      await fetchStatus()
    } else {
      showToast(res?.message || t('insufficientPoints'))
    }
  } finally {
    isActing = false
  }
}

// 今日打卡
const onCheckIn = async () => {
  if (derived.isCheckin || isActing) return

  try {
    isActing = true
    const res = await postCheckin()
    if (res?.code === 0 && res?.data === true) {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } })
      await fetchStatus()
    } else {
      showToast(res?.message || t('networkError'))
    }
  } finally {
    isActing = false
  }
}
</script>

<template>
  <van-skeleton :loading="isLoading" animated class=" !px-0">
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

    <div class="rounded-xl bg-white border border-[#f0f0f0] p-4 shadow-sm space-y-4">
      <!-- 顶部信息 -->
      <div class="flex items-start justify-between">
        <div class="flex items-center text-lg font-bold">
          <div class="text-gray-700">{{ t('dayProgress', { day: derived.checkedDays.length, total: derived.totalDays }) }}</div>
        </div>
        <div class="text-right text-xs text-gray-500 space-y-1">
          <div>{{ t('points') }}: <span class="font-medium text-gray-700">{{ derived.availablePoints }}</span></div>
          <div>{{ t('makeupCard') }}: <span class="font-medium text-gray-700">x{{ derived.makeupCardCount }}</span></div>
        </div>
      </div>

      <!-- 进度条 -->
      <van-progress :percentage="derived.progress" stroke-width="10" track-color="#f0f2f5"
        color="linear-gradient(to right, #3fecff, #6149f6)" />

      <!-- 指标/提示 -->
      <div class="flex items-center justify-between">
        <div class="text-xs text-gray-500">
          {{ t('streak', { days: derived.consecutiveDays }) }}
        </div>
        <div class="text-xs text-gray-500">{{ t('completion', { percent: derived.progress }) }}</div>
      </div>

      <!-- 购买补签卡入口 -->
      <div class="flex items-center justify-between text-xs">
        <div class="text-gray-500">{{ t('buyHint', { cost: derived.makeupCardCost }) }}</div>
        <van-button size="mini" type="primary" plain @click="onRedeemMakeupCard">
          {{ t('redeemMakeupCard') }}
        </van-button>
      </div>

      <CheckinCalendar
        :total-days="derived.totalDays"
        :checked-days="derived.checkedDays"
        :today-index="derived.todayIndex"
        :missed-days="derived.missedDays"
        @select-missed="onMissedDayClick"
      />

      <van-button
        block
        type="primary"
        :disabled="derived.isCheckin || derived.checkedDays.length >= derived.totalDays"
        @click="onCheckIn"
      >
        {{
          derived.checkedDays.length >= derived.totalDays
            ? t('btnCompleted')
            : (derived.isCheckin ? t('btnComeBackTomorrow') : t('btnCheckin'))
        }}
      </van-button>
    </div>
  </van-skeleton>
</template>

<i18n lang="json">{
  "en-US": {
    "dayProgress": "Day {day}/{total}",
    "streak": "Checked in for {days} consecutive days",
    "completion": "Completion {percent}%",
    "btnComeBackTomorrow": "Come back tomorrow",
    "btnCheckin": "Check in today",
    "makeupCard": "Makeup Card",
    "points": "Points",
    "redeemMakeupCard": "Redeem Makeup Card",
    "useMakeupCard": "Use Makeup Card",
    "insufficientPoints": "Insufficient points",
    "purchaseConfirm": "Spend {cost} points to buy a makeup card?",
    "purchaseSuccess": "Purchased successfully",
    "useMakeupConfirm": "Use a makeup card to fill day {day}?",
    "useSuccess": "Makeup succeeded",
    "noMakeupCard": "No makeup card",
    "selectDayToMakeup": "Select a missed day in the calendar to makeup",
    "selectedMissedDay": "Selected day {day}",
    "buyHint": "Makeup costs {cost} points",
    "networkError": "Network error, try again"
  },
  "zh-TW": {
    "dayProgress": "第 {day}/{total} 天",
    "streak": "已連續打卡 {days} 天",
    "completion": "完成度 {percent}%",
    "btnComeBackTomorrow": "明日再來",
    "btnCheckin": "今日打卡",
    "makeupCard": "補簽卡",
    "points": "積分",
    "redeemMakeupCard": "兌換補簽卡",
    "useMakeupCard": "使用補簽卡補簽",
    "insufficientPoints": "積分不足",
    "purchaseConfirm": "花費 {cost} 積分購買補簽卡？",
    "purchaseSuccess": "兌換成功",
    "useMakeupConfirm": "使用補簽卡補簽第 {day} 天？",
    "useSuccess": "補簽成功",
    "noMakeupCard": "補簽卡不足",
    "selectDayToMakeup": "請在日曆中選擇要補簽的日期",
    "selectedMissedDay": "已選擇第 {day} 天",
    "buyHint": "補簽消耗 {cost} 積分",
    "networkError": "網絡錯誤，請重試"
  },
  "ja-JP": {
    "dayProgress": "{day}/{total} 日目",
    "streak": "{days}日連続チェックイン",
    "completion": "達成度 {percent}%",
    "btnComeBackTomorrow": "また明日",
    "btnCheckin": "今日チェックイン",
    "makeupCard": "補填カード",
    "points": "ポイント",
    "redeemMakeupCard": "補填カードを交換",
    "useMakeupCard": "補填カードを使う",
    "insufficientPoints": "ポイントが不足しています",
    "purchaseConfirm": "{cost}ポイントを使って補填カードを購入しますか？",
    "purchaseSuccess": "購入に成功しました",
    "useMakeupConfirm": "第 {day} 日を補填しますか？",
    "useSuccess": "補填に成功しました",
    "noMakeupCard": "補填カードがありません",
    "selectDayToMakeup": "カレンダーで補填する日付を選択してください",
    "selectedMissedDay": "{day}日目を選択しました",
    "buyHint": "補填には {cost} ポイントが必要です",
    "networkError": "ネットワークエラー、もう一度お試しください"
  },
  "ko-KR": {
    "dayProgress": "{day}/{total}일차",
    "streak": "{days}일 연속 출석",
    "completion": "달성도 {percent}%",
    "btnComeBackTomorrow": "내일 다시 오기",
    "btnCheckin": "오늘 체크인",
    "makeupCard": "보충 카드",
    "points": "포인트",
    "redeemMakeupCard": "보충 카드 교환 ({cost}P)",
    "useMakeupCard": "보충 카드 사용",
    "insufficientPoints": "포인트가 부족합니다",
    "purchaseConfirm": "{cost} 포인트로 보충 카드를 구매할까요?",
    "purchaseSuccess": "구매 성공",
    "useMakeupConfirm": "{day}일 차를 보충하시겠습니까?",
    "useSuccess": "보충 성공",
    "noMakeupCard": "보충 카드가 없습니다",
    "selectDayToMakeup": "달력에서 보충할 날짜를 선택하세요",
    "selectedMissedDay": "{day}일을 선택했습니다",
    "buyHint": "보충에는 {cost} 포인트가 필요합니다",
    "networkError": "네트워크 오류입니다. 다시 시도하세요"
  }
}</i18n>
