<script setup lang="ts">
const { setModal } = $(uiStore());
const { tradeVolume } = $(tradeStore());
</script>
<template>
  <van-button
    size="small"
    class="mr-1! w-8 h-8"
    plain
    round
    hairline
    @click="setModal('tradeSetting', true)"
    >{{ tradeVolume }}</van-button
  >
</template>
