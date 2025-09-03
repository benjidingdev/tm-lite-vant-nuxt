<script setup>
const { userInfo } = $(userStore());

</script>

<template>
  <section class="w-full h-[calc(100dvh-var(--nav-height))] space-y-px overflow-y-scroll">

    <InviteNewUserNotice />

    <div class="w-full flex flex-col items-center justify-center bg-white py-2">
      <img class="size-30 rounded-full" :src="userInfo.avatar" alt="">
      <div class="text-center">{{ userInfo.nickname }}</div>
      <div class="text-center text-[64px] text-orange-500">750 TUIT</div>
    </div>

    <InviteUserList />
    <InviteLeaderBoard />
  </section>
</template>
