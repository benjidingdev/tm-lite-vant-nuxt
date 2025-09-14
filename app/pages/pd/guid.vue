<script setup>

definePageMeta({
  layout: "x",
});

const handleBack = () => {
  window.history.back()
}
</script>

<template>
  <button class="text-base ml-2 absolute z-999 top-6 border-0" @click="handleBack">
    <van-icon name="arrow-left" size="30" />
  </button>

  <PdAuth />
</template>
