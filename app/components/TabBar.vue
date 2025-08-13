<template>
  <van-tabbar v-model="active">
    <van-tabbar-item
      @click="goToLInk('/')"
      icon="completed-o"
    ></van-tabbar-item>
    <van-tabbar-item @click="goToLInk('/user')" icon="user-o"></van-tabbar-item>
  </van-tabbar>
</template>

<script setup lang="ts">
const active = ref(0);
const goToLInk = async (path: string) => {
  await navigateTo(path);
};
</script>
