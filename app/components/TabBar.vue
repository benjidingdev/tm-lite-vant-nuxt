<template>
  <van-tabbar v-model="active" safe-area-inset-bottom>
    <van-tabbar-item @click="goToLInk('/')" icon="chart-trending-o">
      {{ $t("tabBar.Markets") }}</van-tabbar-item
    >
    <van-tabbar-item @click="goToLInk('/earn')" icon="balance-o">
      {{ $t("tabBar.Earn") }}</van-tabbar-item
    >
    <van-tabbar-item @click="goToLInk('/invite')" icon="hot-o">{{
      $t("tabBar.Invite")
    }}</van-tabbar-item>
    <van-tabbar-item @click="goToLInk('/user')" icon="user-o">{{
      $t("tabBar.User")
    }}</van-tabbar-item>
  </van-tabbar>
</template>

<script setup lang="ts">
const active = ref(0);
const { locale } = $(useI18n());
const goToLInk = async (path: string) => {
  const url = locale === "en" ? path : `/${locale}${path}`;
  await navigateTo(url);
};
</script>
