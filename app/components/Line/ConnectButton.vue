<template>
  <van-button class="min-w-[280px] min-h-[48px] max-h-[72px]" size="small" type="success"
    @click="handleClick">Connect
    <template #icon>
      <van-icon name="/icons/line.png" />
    </template>
  </van-button>
  <!-- <van-button type="primary" class="custom-btn">
    <img src="/icons/line.png" class="icon-white" alt="icon" />
    <span class="ml-1">按钮文字</span>
  </van-button> -->
</template>

<script setup lang="ts">
const emit = defineEmits(['click'])

const loading = ref(false)
const handleClick = async () => {
  try {
    loading.value = true
    emit('click')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
:deep(.van-button__icon) {
  font-size: 22px;
  filter: brightness(0) invert(1);
}

:deep(.van-button__text) {
  font-size: 16px;
  font-family: sans-serif;
}

:deep(.van-button) {
  border-radius: 0.25px;
  min-height: 48px;
  max-height: 72px;
  min-width: 280px;
}
</style>
