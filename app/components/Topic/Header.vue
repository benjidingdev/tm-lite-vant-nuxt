<script lang="ts" setup>
defineProps({
  topic: {
    type: Object,
    default: () => {},
  }
})
</script>
<template>
  <div>
    <FloatMenu />
    <div class="w-full flex flex-col justify-center items-center">
      <img :src="topic?.meta?.logo" alt="" class="w-30 mt-10">
      <p class="text-[30px] font-900 mb-10 leading-[1.2] py-2 text-center">{{ topic?.title }}</p>
    </div>
  </div>
</template>
