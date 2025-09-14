<script setup>
const { t } = useI18n()

const { user = {} } = defineProps(['user'])
</script>

<template>
  <div id="my-div" class="relative w-[320px] rounded-2xl p-8 bg
      border border-[#16653480] text-center text-white shadow-lg">

    <div class="mt-4 flex flex-col items-center">
      <div class="h-20 w-20 rounded-full bg-[#354366] flex items-center justify-center overflow-hidden">
        <img :src="user.avatar" alt="" class="w-full h-full">
      </div>
      <h2 class="mt-4 text-xl font-bold">{{ user.name }}</h2>
      <p class="text-sm text-gray-400">@{{ user.user_name }}</p>
    </div>

    <div class="mt-14 grid grid-cols-2 gap-y-6">
      <div>
        <h3 class="text-4xl font-semibold">{{ user.refCount || '-' }}</h3>
        <p class="text-xs text-gray-400">{{ t('Referrals') }}</p>
      </div>
      <div>
        <h3 class="text-4xl font-semibold">{{ user.refCount * 100 || '-' }}</h3>
        <p class="text-xs text-gray-400">{{ t('PDC') }}</p>
      </div>
    </div>

  </div>
</template>


<i18n lang="json">{
  "en-US": {
    "Referrals": "Referrals",
    "PDC": "PDCoin"
  },
  "zh-TW": {
    "Referrals": "Referrals",
    "PDC": "PDCoin"
  },
  "ja-JP": {
    "Referrals": "Referrals",
    "PDC": "PDCoin"
  },
  "ko-KR": {
    "Referrals": "Referrals",
    "PDC": "PDCoin"
  }
}</i18n>
