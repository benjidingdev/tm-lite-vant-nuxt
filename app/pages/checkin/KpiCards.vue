<script setup lang="ts">
import 'odometer/themes/odometer-theme-default.css'
import { useQuery } from '@tanstack/vue-query'
import { getCheckinKpi } from '~/api/checkin'
import { createOdometer } from '@/utils/odometer'

const { t } = useI18n()

let participants = $ref(0)
let pool = $ref(0)

// 对应 DOM 引用，供 odometer 绑定
const participantsEl = $ref<HTMLElement | null>(null)
const poolEl = $ref<HTMLElement | null>(null)

// Odometer 实例
let participantsOdo: any
let poolOdo: any


// 初始化 odometer
const initOdometers = async () => {
  if (participantsEl && !participantsOdo) {
    participantsOdo = await createOdometer(participantsEl, { initial: 0 })
    setTimeout(() => participantsOdo?.update(participants), 60)
  }
  if (poolEl && !poolOdo) {
    poolOdo = await createOdometer(poolEl, { initial: 0 })
    setTimeout(() => poolOdo?.update(pool), 60)
  }
}

const { data: kpiRes, isLoading } = useQuery({
  queryKey: ['checkin-kpi'],
  queryFn: getCheckinKpi,
  refetchInterval: 50000,
})

// 同步接口返回的 KPI 到本地状态
watch(
  () => kpiRes?.value?.data?.kpi,
  (kpi) => {
    if (!kpi) return
    participants = Number(kpi.participants || 0)
    pool = Number(kpi.pool || 0)
  },
  { immediate: true }
)

// 当加载完成后，统一进行 odometer 的初始化
watchEffect(async () => {
  if (!isLoading.value) {
    await nextTick()
    initOdometers()
  }
})

watch(() => isLoading.value, async (v) => {
  if (!v) {
    await nextTick()
    initOdometers()
  }
})

// 数值变化时驱动 odometer 动画更新
watch(() => participants, (val) => { if (participantsOdo) participantsOdo.update(val) })
watch(() => pool, (val) => { if (poolOdo) poolOdo.update(val) })
</script>

<template>
  <van-skeleton :loading="isLoading" animated  class="!px-0">
    <template #template>
      <div class="grid grid-cols-2 gap-3 w-full">
        <div class="rounded-xl bg-white border border-[#f0f0f0] p-4 shadow-sm">
          <div class="h-3 w-16 bg-[#f2f3f5] rounded" />
          <div class="h-6 w-24 bg-[#f2f3f5] rounded mt-3" />
        </div>
        <div class="rounded-xl bg-white border border-[#f0f0f0] p-4 shadow-sm">
          <div class="h-3 w-16 bg-[#f2f3f5] rounded" />
          <div class="h-6 w-24 bg-[#f2f3f5] rounded mt-3" />
        </div>
      </div>
    </template>

    <div class="grid grid-cols-2 gap-3">
      <div class="rounded-xl bg-white border border-[#f0f0f0] p-4 shadow-sm">
        <div class="text-xs text-gray-500">{{ t('labels.participants') }}</div>
        <div ref="participantsEl" class="text-2xl font-semibold mt-1 odometer">{{ participants }}</div>
      </div>
      <div class="rounded-xl bg-white border border-[#f0f0f0] p-4 shadow-sm">
        <div class="text-xs text-gray-500">{{ t('labels.pool') }}</div>
        <div ref="poolEl" class="text-2xl font-semibold mt-1 odometer">{{ pool }}</div>
      </div>
    </div>
  </van-skeleton>
</template>

<i18n lang="json">{
  "en-US": {
    "labels": {
      "participants": "Participants",
      "pool": "Points Pool"
    }
  },
  "zh-TW": {
    "labels": {
      "participants": "參與人數",
      "pool": "當前積分池"
    }
  },
  "ja-JP": {
    "labels": {
      "participants": "参加者数",
      "pool": "現在のポイントプール"
    }
  },
  "ko-KR": {
    "labels": {
      "participants": "참여 인원",
      "pool": "현재 포인트 풀"
    }
  }
}</i18n>
