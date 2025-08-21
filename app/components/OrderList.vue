<script setup lang="ts">
let active = $ref(0);
</script>

<template>
  <van-tabs :active="active">
    <van-tab :title="$t('Positions')">
      <OrderPosition />
    </van-tab>
    <van-tab :title="$t('Open Orders')">
      <OrderOpen />
    </van-tab>
    <van-tab :title="$t('History')">
      <OrderHistory />
    </van-tab>
  </van-tabs>
</template>
