<script setup>
const { setModal } = $(uiStore());

</script>

<template>
  <!-- <section class="w-full h-[calc(100dvh)] flex items-center justify-center">
    <button class="w-[200px] h-[50px] bg-[#1890ff] text-white rounded-md" @click="setModal('loginModal', true)">{{ $t("Login") }}</button>
  </section> -->

  <section class="w-full min-h-[calc(100dvh)] flex flex-col items-center justify-center space-y-2 px-5">
    <div class="w-full h-110 flex flex-col items-center justify-center bg-gray-100 rounded-[12px] p-5">

      <div class="flex-1 flex flex-col items-center justify-center">
        <!-- <img class="size-30 rounded-full" :src="userInfo.avatar" alt="">
        <div class="text-center">{{ userInfo.nickname }}</div> -->
        <div class="text-center text-[64px] text-orange-500">+50 TUIT</div>
      </div>

      <div class="flex justify-between items-center w-full space-x-2">
        <NuxtLink to="/invite" class="flex-1 h-[50px] bg-gray-500 text-white rounded-md flex items-center justify-center">{{ $t("Later") }}</NuxtLink>
        <button class="flex-1 h-[50px] bg-[#1890ff] text-white rounded-md"  @click="setModal('loginModal', true)">{{ $t("Login  +50 TUIT") }}</button>
      </div>
    </div>
  </section>
</template>
