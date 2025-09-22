<script setup lang="ts">
const { t } = useI18n()
const rules = [
  t('rules.r1'),
  t('rules.r2'),
  t('rules.r3'),
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
      <div class="text-sm text-gray-700">{{ t('title') }}</div>
      <ul class="list-disc pl-5 space-y-1 text-xs text-gray-600">
        <li v-for="(r, i) in rules" :key="i">{{ r }}</li>
      </ul>
    </div>
  </van-skeleton>
</template>

<i18n lang="json">{
  "en-US": {
    "title": "Event Rules",
    "rules": {
      "r1": "Check-in must be continuous; interrupting will reset points to zero.",
      "r2": "Complete the whole campaign to receive double points back.",
      "r3": "Successful finishers will evenly split the points pool; points are in-app and cannot be withdrawn or transferred."
    }
  },
  "zh-TW": {
    "title": "活動規則",
    "rules": {
      "r1": "活動需連續打卡，中斷則積分清零。",
      "r2": "完成全程返還雙倍積分。",
      "r3": "成功完成者平均分配積分池；積分為站內積分，不可提現/轉贈。"
    }
  },
  "ja-JP": {
    "title": "イベントルール",
    "rules": {
      "r1": "連続チェックインが必要です。中断するとポイントはリセットされます。",
      "r2": "全行程を完了すると、ダブルポイントを還元します。",
      "r3": "達成者でポイントプールを均等分配。ポイントはアプリ内ポイントで、出金/譲渡はできません。"
    }
  },
  "ko-KR": {
    "title": "이벤트 규칙",
    "rules": {
      "r1": "연속 출석이 필요하며 중단 시 포인트가 0으로 초기화됩니다.",
      "r2": "전체 완료 시 더블 포인트가 지급됩니다.",
      "r3": "성공 완주자는 포인트 풀을 균등 분배하며, 포인트는 앱 내 포인트로 출금/양도가 불가능합니다."
    }
  }
}</i18n>
