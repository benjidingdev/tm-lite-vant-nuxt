<script setup lang="ts">
import { getInterestNoticeList } from '~/api/interest'

let loading = $ref(true)
setTimeout(() => {
  loading = false
}, 1000)

let notices = $ref([
  '完成全程返还 20,000 双倍积分',
  '成功者平分积分池',
  '中断清零',
])

const getList = async () => {
  const res = await getInterestNoticeList()
  console.log(res);
}

onMounted(()=> {
  getList()
})
</script>

<template>
  <van-skeleton :loading="loading" animated class="!px-0">
    <template #template>
      <div class="w-full rounded-xl bg-white border border-[#f0f0f0] p-4 shadow-sm">
        <div class="h-3 w-full bg-[#f2f3f5] rounded" />
      </div>
    </template>

    <van-notice-bar class="rounded-xl overflow-hidden" left-icon="volume-o" color="#8b5e00" :scrollable="false">
      <van-swipe vertical class="h-10 leading-10" :autoplay="3000" :touchable="false" :show-indicators="false">
        <van-swipe-item v-for="u in notices" :key="u">{{ u }}</van-swipe-item>
      </van-swipe>
    </van-notice-bar>
  </van-skeleton>
</template>
