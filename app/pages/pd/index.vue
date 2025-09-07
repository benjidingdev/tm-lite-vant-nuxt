<script setup>
definePageMeta({
  layout: "x",
});

let tiers = [
  { rank: 'S', bg: 'rgb(255, 127, 127)', users: [] },
  { rank: 'A', bg: 'rgb(255, 191, 127)', users: [] },
  { rank: 'B', bg: 'rgb(255, 223, 127)', users: [] },
  { rank: 'C', bg: 'rgb(255, 127, 191)', users: [] },
  { rank: 'D', bg: 'rgb(255, 127, 223)', users: [] },
  { rank: 'E', bg: 'rgb(255, 127, 223)', users: [] },
  { rank: 'F', bg: 'rgb(255, 127, 223)', users: [] },
  { rank: 'G', bg: 'rgb(255, 127, 223)', users: [] },
  { rank: 'H', bg: 'rgb(255, 127, 223)', users: [] },

  { rank: 'D', bg: 'rgb(255, 127, 223)', users: [] },
  { rank: 'E', bg: 'rgb(255, 127, 223)', users: [] },
  { rank: 'F', bg: 'rgb(255, 127, 223)', users: [] },
  { rank: 'G', bg: 'rgb(255, 127, 223)', users: [] },
  { rank: 'H', bg: 'rgb(255, 127, 223)', users: [] },

  { rank: 'D', bg: 'rgb(255, 127, 223)', users: [] },
  { rank: 'E', bg: 'rgb(255, 127, 223)', users: [] },
  { rank: 'F', bg: 'rgb(255, 127, 223)', users: [] },
  { rank: 'G', bg: 'rgb(255, 127, 223)', users: [] },
  { rank: 'H', bg: 'rgb(255, 127, 223)', users: [] },

  { rank: 'D', bg: 'rgb(255, 127, 223)', users: [] },
  { rank: 'E', bg: 'rgb(255, 127, 223)', users: [] },
  { rank: 'F', bg: 'rgb(255, 127, 223)', users: [] },
  { rank: 'G', bg: 'rgb(255, 127, 223)', users: [] },
  { rank: 'H', bg: 'rgb(255, 127, 223)', users: [] },
]
</script>

<template>
  <p class="text-4xl w-full text-center mt-8 sticky top-0 z-1 bg-black">Tier Rank Wall</p>

  <section class="w-full h-[calc(100dvh)] h-auto flex flex-col items-center justify-center space-y-[10px] mt-8">
    <div class="flex justify-between items-stretch w-full border-0 border-red-500" v-for="tier in tiers"
      :key="tier.rank">
      <p class="w-12 leading-20 text-center" :style="{ background: tier.bg || 'blue' }">{{ tier.rank }}</p>
      <div class="flex-1 grid grid-cols-5 gap-[1px]">
        <div v-for="n in 4" :key="n" class="border-0 flex flex-col items-center justify-center">
          <div class="flex-1 flex items-center justify-center">
            <img class="w-full h-full" src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg" />
          </div>
          <p class="leading-5 text-center border-0 w-full">name</p>
        </div>

        <div class="border-0 flex flex-col items-center justify-center">

          <p class="border-0 w-full flex items-center justify-center">
            <span class="border-0 mb-[2px] leading-10">more</span>
            <van-icon name="arrow" />
          </p>
        </div>
      </div>

      <!-- <div class="border-1 min-w-5 h-20 flex flex-col items-center justify-center space-y-2">
        <span>15</span>
        <van-icon name="arrow" />
      </div> -->
    </div>

  </section>
</template>
