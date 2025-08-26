<script setup lang="ts">
const { setModal } = $(uiStore());
const { cardCount, successCount } = $(requestQueueStore());
</script>
<template>
  <van-button size="small" class="mr-1! w-8 h-8" plain round hairline>{{
    successCount }}/{{ cardCount }}</van-button>
</template>
