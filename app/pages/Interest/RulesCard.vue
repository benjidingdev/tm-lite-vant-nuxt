<script setup lang="ts">
const rules = [
  '活动需连续打卡，中断则积分清零。',
  '完成全程返还 20,000 双倍积分。',
  '成功完成者平分积分池；积分为站内积分，不可提现/转赠。',
]
let loading = $ref(true)
setTimeout(() => {
  loading = false
}, 1000)
</script>

<template>
  <van-skeleton :loading="loading" animated class="!px-0">
    <template #template>
      <div class="w-full rounded-xl bg-white border border-[#f0f0f0] p-4 shadow-sm space-y-2">
        <div class="h-3 w-20 bg-[#f2f3f5] rounded" />
        <div class="space-y-2">
          <div class="h-3 w-[90%] bg-[#f2f3f5] rounded" />
          <div class="h-3 w-[85%] bg-[#f2f3f5] rounded" />
          <div class="h-3 w-[80%] bg-[#f2f3f5] rounded" />
        </div>
      </div>
    </template>

    <div class="w-full rounded-xl bg-white border border-[#f0f0f0] p-4 shadow-sm space-y-2">
    <div class="text-sm text-gray-700">活动规则</div>
    <ul class="list-disc pl-5 space-y-1 text-xs text-gray-600">
      <li v-for="(r, i) in rules" :key="i">{{ r }}</li>
    </ul>
  </div>
  </van-skeleton>
</template>
