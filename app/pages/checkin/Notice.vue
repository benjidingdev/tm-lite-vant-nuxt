<script setup lang="ts">
import { getCheckinNoticeList } from '~/api/checkin'
const { t } = useI18n()

let loading = $ref(true)
let notices = $ref<string[]>([])

const getList = async () => {
  try {
    const res = await getCheckinNoticeList()
   notices = res?.data?.noticesList.map((i:string)=> {
    return t(i.key)
   }) || []
  } finally {
    loading = false
  }
}

onMounted(() => {
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

<i18n lang="json">{
  "en-US": {
    "notices": {
      "return": "Complete the whole campaign to receive 20,000 double points back",
      "poolSplit": "Finishers will evenly split the points pool",
      "reset": "Interrupted progress resets to zero"
    }
  },
  "zh-TW": {
    "notices": {
      "return": "完成全程返還 20,000 雙倍積分",
      "poolSplit": "成功者平均分配積分池",
      "reset": "中斷清零"
    }
  },
  "ja-JP": {
    "notices": {
      "return": "全行程を完了すると、ダブルポイント20,000を還元",
      "poolSplit": "達成者でポイントプールを均等分配",
      "reset": "中断するとリセット"
    }
  },
  "ko-KR": {
    "notices": {
      "return": "전체 완료 시 20,000 더블 포인트 반환",
      "poolSplit": "성공자들이 포인트 풀을 균등 분배",
      "reset": "중단 시 초기화"
    }
  }
}</i18n>
