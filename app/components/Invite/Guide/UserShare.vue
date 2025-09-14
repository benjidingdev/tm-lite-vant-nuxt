<script setup lang="ts">
const { userInfo } = $(userStore());

async function onShare() {
  inviteUser(userInfo.inviteCode, '/invite/guide')
}

</script>


<template>
  <section class="w-full flex flex-col items-center justify-center space-y-2 p-5">
    <div id="shareTarget"
      class="w-full h-[60dvh] flex flex-col items-center justify-center bg-gray-100 rounded-[12px] p-5 relative">
      <slot />

      <div class="flex-1 flex flex-col items-center justify-center">
        <img class="size-20 rounded-full" :src="userInfo.avatar" alt="">
        <div class="text-center">{{ userInfo.nickname }}</div>

        <div class="text-center text-[48px] text-orange-500 mt-12">+10 TUIT</div>
      </div>

      <div class="flex justify-between items-center w-full space-x-2">
        <van-button block type="primary" @click="onShare">{{ $t("Share") }}</van-button>
      </div>

      <div class="text-center text-[12px] text-gray-500 mt-2">{{ $t('success invite a friend and get the rewards.') }}
      </div>

    </div>
  </section>
</template>
