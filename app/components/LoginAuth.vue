<template>
</template>

<script setup lang="ts">
import { onMounted, watch, ref } from "vue";

const { loadUserInfo } = $(coreStore());

onMounted(() => {
  loadUserInfo();
});
</script>
