<script setup lang="ts">
import { showToast } from 'vant'
import confetti from "canvas-confetti";

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
  // showToast('打卡成功 +50 积分')
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
          <div class="text-sm text-gray-700">第 {{ day }}/{{ totalDays }} 天</div>
          <div class="text-xs text-gray-500">剩余 {{ remainingTime }}</div>
        </div>
        <van-tag type="success" v-if="isCheckedToday">今日已打卡</van-tag>
        <van-tag type="danger" v-else>待打卡</van-tag>
      </div>

      <van-progress :percentage="progress" stroke-width="10" track-color="#f0f2f5" color="linear-gradient(to right, #3fecff, #6149f6)" />

      <div class="flex items-center justify-between">
        <div class="text-xs text-gray-500">已连续打卡 {{ consecutiveDays }} 天</div>
        <div class="text-xs text-gray-500">完成度 {{ progress }}%</div>
      </div>

      <van-button block type="primary" :disabled="isCheckedToday" @click="onCheckIn">
        {{ isCheckedToday ? '明日再来' : '今日打卡' }}
      </van-button>
    </div>
  </van-skeleton>

</template>
