<script setup lang="ts">
const { requestCount, successCount, isProcessing } = $(requestQueueStore());
</script>
<template>
  <button v-if="requestCount > 0" class="flex justify-center items-center h-8 space-x-2 px-2 border-1 border-solid border-gray-100 rounded-full">
    <van-loading size="12" v-if="isProcessing" />
    <span class="text-xs" style="color: var(--van-button-default-color);">{{ successCount }}/{{ requestCount }}</span>
  </button>
</template>
