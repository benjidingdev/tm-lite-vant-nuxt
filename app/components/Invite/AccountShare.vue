<script setup>
const { userInfo } = $(userStore());

async function onShare() {
  // const target = document.getElementById('shareTarget');
  // await captureTargetToPng('shareImageName', target);
  inviteUser(userInfo.inviteCode)
}
</script>


<template>
  <section class="w-full flex flex-col items-center justify-center space-y-2 p-5">
    <div id="shareTarget" class="w-full flex flex-col items-center justify-center bg-gray-100 rounded-[12px] p-5 relative">
      <slot />

      <div class="flex-1 flex flex-col items-center justify-center">
        <img class="size-30 rounded-full" :src="userInfo.avatar" alt="">
        <div class="text-center">{{ userInfo.nickname }}</div>
        <slot name="coin" />
      </div>

      <div class="flex justify-between items-center w-full space-x-2 mt-12">
        <van-button block type="primary" @click="onShare">{{ $t("Share") }}</van-button>
      </div>
    </div>
  </section>
</template>
