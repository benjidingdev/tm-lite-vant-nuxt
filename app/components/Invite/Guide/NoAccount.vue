<script setup>
const { setModal } = $(uiStore());

</script>

<template>
  <section class="w-full flex flex-col items-center justify-center space-y-2 p-8 ">
    <div class="w-full h-110 flex flex-col items-center justify-center bg-gray-100 rounded-[12px] p-5 relative">
      <slot />

      <div class="flex-1 flex flex-col items-center justify-center">
        <img class="size-40 rounded-full transform transition-transform duration-1000 hover:rotate-y-180"
        src="@/assets/img/gold-coins.jpg" />
        <div class="text-center text-[24px] text-orange-500">+50 TUIT</div>
      </div>

      <div class="flex justify-between items-center w-full space-x-2">
        <van-button block type="primary" @click="setModal('loginModal', true)">{{ $t("Login") }}</van-button>
      </div>
      <div class="text-center text-[12px] text-gray-500 mt-2">{{ $t('login with your email and get the rewards.') }}</div>
    </div>
  </section>
</template>
