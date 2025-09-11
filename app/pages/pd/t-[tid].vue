<script setup lang="ts">
definePageMeta({
  layout: "x",
});

const { t } = useI18n()
const route = useRoute()

const handleBack = () => {
  window.history.back()
}
</script>
<template>
  <div>
    <p class="text-4xl w-full mb-2 sticky top-0 z-1 flex justify-between items-center bg-black">
      <span class="text-base ml-2" @click="handleBack">
        <van-icon name="arrow-left" size="30" />
      </span>
      <span class="flex-1 text-center">
        {{
          t('Topic Detail', {
            tier: route.params.tid
          })
        }}
      </span>
    </p>

    <van-card num="2" price="2.00" desc="描述信息" title="商品标题" v-for="n in 10" :key="n"
      thumb="https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg" />
  </div>
</template>
<i18n lang="json">{
  "en-US": {
    "Topic Detail": "Topic Detail {tier}"
  },
  "zh-TW": {
    "Topic Detail": "Topic Detail {tier}"
  },
  "ja-JP": {
    "Topic Detail": "Topic Detail {tier}"
  },
  "ko-KR": {
    "Topic Detail": "Topic Detail {tier}"
  }
}</i18n>
