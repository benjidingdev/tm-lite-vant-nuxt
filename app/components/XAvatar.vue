<script setup lang="ts">
defineProps({
  src: {
    type: String,
    default: '',
  },
})
</script>
<template>
  <van-image :src="xAvatar(src)">
    <template v-slot:loading>
      <van-loading type="spinner" size="20" />
    </template>
  </van-image>
</template>
