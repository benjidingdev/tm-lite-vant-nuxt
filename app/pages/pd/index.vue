<script setup>
definePageMeta({
  layout: "x",
});

let tiers = [
  { rank: 'S', bg: 'rgb(255, 127, 127)', users: [] },
  { rank: 'A', bg: 'rgb(255, 191, 127)', users: [] },
  { rank: 'B', bg: 'rgb(255, 223, 127)', users: [] },
  { rank: 'C', bg: 'rgb(255, 127, 191)', users: [] },
  { rank: 'D', bg: 'rgb(127, 127, 223)', users: [] },
  { rank: 'E', bg: 'rgb(68, 127, 255)', users: [] },
  { rank: 'F', bg: 'rgb(10, 127, 35)', users: [] },
  { rank: 'G', bg: 'rgb(255, 10, 223)', users: [] },
  { rank: 'H', bg: 'rgb(255, 127, 10)', users: [] },
])

async function loadData() {
  const rz = await $fetch('/api/pd')
  console.log(rz)

  tiers[3].users = rz.map(item => ({
    id: item?.twitterid,
    avatar: item?.avatar,
    name: item?.fullname,
    user_name: item?.slug
  }))
  // const { data, error } = await client.from('x_profiles').select('*')
  // console.log({ data, error })
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <p class="text-4xl w-full text-center mt-8 sticky top-0 z-1 bg-black">Tier Rank Wall</p>

  <section class="w-full h-[calc(100dvh)] h-auto flex flex-col items-center justify-center space-y-[10px] mt-8">
    <div class="flex justify-between items-stretch w-full border-0 border-red-500" v-for="(tier, index) in tiers"
      :key="tier.rank">

      <p class="w-8 leading-20 text-center text-2xl" :style="{ background: tier.bg || 'blue' }">{{ tier.rank }}</p>

      <div class="flex-1 grid grid-cols-4 gap-[1px]">
        <NuxtLink :to="`pd/u-${n}`" v-for="n in (tier.users.length ? tier.users : (index + 1 >= 3 ? 3 : index + 1))" :key="n"
          class="border-0 flex flex-col items-center justify-center relative">
          <img class="w-full h-full bg-cover" :src="n.avatar || 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'" />
          <p class="leading-5 text-center text-xs border-0 w-full absolute bottom-0 bg-black/10 backdrop-blur-xs">{{ n.name || 'name' }}</p>
        </NuxtLink>

        <NuxtLink v-if="index >= 3" :to="`pd/t-${tier.rank}`"
          class="border-0 flex flex-col items-center justify-center">
          <p class="border-0 w-full flex items-center justify-center">
            <span class="border-0 mb-[2px] leading-10">more</span>
            <van-icon name="arrow" />
          </p>
        </NuxtLink>
      </div>

      <!-- <div class="border-1 min-w-5 h-20 flex flex-col items-center justify-center space-y-2">
        <span>15</span>
        <van-icon name="arrow" />
      </div> -->
    </div>

  </section>
</template>
