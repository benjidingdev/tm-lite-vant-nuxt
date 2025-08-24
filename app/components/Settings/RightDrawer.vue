<script setup lang="ts">
  const { modalIsShow } = $(uiStore());
  const hash = import.meta.env.NUXT_PUBLIC_HASH
  const branch = import.meta.env.NUXT_PUBLIC_BRANCH
</script>
<template>
  <van-popup v-model:show="modalIsShow.settings" position="right" :style="{ width: '80%', height: '100%' }">
    <LangSwitcherLabel />
    <TradeSettingLabel />
    <AuthLogoutLabel />
    <van-cell-group>
      <van-cell :title="$t('Hash')" :value="hash" />
      <van-cell :title="$t('Branch')" :value="branch" />
    </van-cell-group>
  </van-popup>
</template>
