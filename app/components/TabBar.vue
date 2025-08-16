<template>
  <van-tabbar v-model="active">
    <van-tabbar-item @click="goToLInk('/')" icon="chart-trending-o">
      Markets</van-tabbar-item
    >
    <van-tabbar-item @click="goToLInk('/earn')" icon="balance-o"
      >Earn</van-tabbar-item
    >
    <van-tabbar-item @click="goToLInk('/invite')" icon="hot-o"
      >Invite</van-tabbar-item
    >
    <van-tabbar-item @click="goToLInk('/user')" icon="user-o"
      >User</van-tabbar-item
    >
  </van-tabbar>
</template>

<script setup lang="ts">
const active = ref(0);
const goToLInk = async (path: string) => {
  await navigateTo(path);
};
</script>
