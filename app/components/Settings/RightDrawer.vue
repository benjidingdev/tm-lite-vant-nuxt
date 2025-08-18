<template>
  <van-popup v-model:show="modalIsShow.settings" position="right" :style="{ width: '80%', height: '100%' }">
    <LangSwitcherLabel />
    <TradeSettingLabel />
    <AuthLogoutLabel />
  </van-popup>
</template>

<script setup lang="ts">
  const { modalIsShow } = $(uiStore());
</script>