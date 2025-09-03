<script setup>
const { userInfo } = $(userStore());

// http://192.168.3.230:31734/doc.html#/topic/用户前端%20-%20代币信息/getTokenBalance
</script>


<template>
  <section class="w-full flex flex-col items-center justify-center space-y-2 p-5">
    <div class="w-full flex flex-col items-center justify-center bg-gray-100 rounded-[12px] p-5 relative">
      <slot />

      <div class="flex-1 flex flex-col items-center justify-center">
        <img class="size-30 rounded-full" :src="userInfo.avatar" alt="">
        <div class="text-center">{{ userInfo.nickname }}</div>
        <div class="text-center text-[24px] text-orange-500">+10 TUIT</div>
      </div>

      <div class="flex justify-between items-center w-full space-x-2 mt-12">
        <van-button block type="primary" @click="inviteUser(userInfo.inviteCode)">{{ $t("Share") }}</van-button>
      </div>
    </div>
  </section>
</template>
