<script setup lang="ts">
const { setModal } = $(uiStore());
const { requestCount, successCount } = $(requestQueueStore());
</script>
<template>
  <van-button v-if="requestCount > 0" size="small" class="mr-1! w-8 h-8" plain round hairline>{{
    successCount }}/{{ requestCount }}</van-button>
</template>
