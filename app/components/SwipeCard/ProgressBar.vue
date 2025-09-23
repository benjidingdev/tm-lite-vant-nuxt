<script lang="ts" setup>
const props = defineProps({
  lastTradePrice: {
    type: Number,
  },
});
const { lastTradePrice } = props;
</script>

<template>
  <div class="flex items-center w-full max-w-lg rounded-full">
    <div class="relative flex-grow h-4 rounded-full overflow-hidden">
      <div class="absolute inset-y-0 left-0 gradient-left text-white text-left pl-2 text-xs"
        :style="{ width: lastTradePrice + '%' }">
        <span>{{ lastTradePrice }}%</span>
      </div>
      <div class="absolute inset-y-0 right-0 gradient-right text-white text-right pr-2 text-xs"
        :style="{ width: 100 - (lastTradePrice) + '%' }">
        <span>{{ 100 - lastTradePrice }}%</span>
      </div>
    </div>
  </div>
</template>

<style>
.gradient-left {
  background-image: linear-gradient(to right, #1652F0, #1854ee);
}

.gradient-right {
  background-image: linear-gradient(to right, #D103FB, rgb(242, 111, 179));
}
</style>
