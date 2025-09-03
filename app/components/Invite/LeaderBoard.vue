<script setup>
const { userInfo } = $(userStore());
</script>

<template>
  <section class="w-full flex flex-col items-center justify-center bg-white py-2 text-sm">
    <div class="w-full px-5 grid grid-cols-[2fr_1fr_1fr] justify-center items-center space-y-2 text-gray-700" v-for="n in 10" :key="n">
      <div class="flex justify-start items-center space-x-1 border-0">
        <img :src="userInfo.avatar" class="rounded-full size-6" alt="">
        <span>{{ userInfo.nickname }}</span>
      </div>
      <div class="text-center border-0">50</div>
      <div class="justify-self-end border-0">700 TUIT</div>
    </div>

    <div class="w-full text-right text-[12px] text-blue-500 pr-4">{{ $t('20th among all user rankings.') }}</div>
  </section>
</template>
