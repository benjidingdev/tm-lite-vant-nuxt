<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
<template>
  <div class="relative rounded-full text-white underline underline-offset-4 -mt-7 text-xs w-full flex justify-center items-center">
    <NuxtLink to="/invite" class="">
      <!-- <van-icon name="cross" /> -->
       {{ t('Skip') }}
    </NuxtLink>
  </div>
</template>

<i18n lang="json">{
  "en-US": {
    "Skip": "Skip >>>"
  },
  "zh-TW": {
    "Skip": "跳過"
  },
  "ja-JP": {
    "Skip": "スキップ"
  },
  "ko-KR": {
    "Skip": "跳過"
  }
}</i18n>
