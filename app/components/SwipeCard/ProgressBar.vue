<script lang="ts" setup>
const props = defineProps({
  lastTradePrice: {
    type: Number,
  },
});
const { lastTradePrice } = props;
console.log("lastTradePrice", lastTradePrice);
</script>

<template>
  <div class="flex items-center w-full max-w-lg rounded-full">
    <span class="text-xl font-bold text-gray-400 mr-2">YES</span>

    <div class="relative flex-grow h-6 rounded-full overflow-hidden">
      <div
        class="absolute inset-y-0 left-0 gradient-left text-white text-left pl-2"
        :style="{ width: lastTradePrice + '%' }"
      >
        <span>{{ lastTradePrice }}%</span>
      </div>
      <div
        class="absolute inset-y-0 right-0 gradient-right text-white text-right pr-2"
        :style="{ width: 100 - lastTradePrice + '%' }"
      >
        <span>{{ 100 - lastTradePrice }}%</span>
      </div>
    </div>

    <span class="text-xl font-bold text-gray-400 ml-2">NO</span>
  </div>
</template>


