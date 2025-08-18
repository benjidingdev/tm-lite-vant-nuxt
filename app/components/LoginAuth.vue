<template>
</template>

<script setup lang="ts">
import { onMounted, watch, ref } from "vue";

const { loadUserInfo } = $(userStore());

onMounted(() => {
  loadUserInfo();
});
</script>
