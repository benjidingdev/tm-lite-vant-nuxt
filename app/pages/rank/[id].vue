<script setup>
definePageMeta({
  layout: "x",
});

const debug = useDebug('pd')
const { hasTwitterLogin, twitterIdentity, supabseUser } = $(supabaseStore())

let tiers = $ref([
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
  const rz = await doFetch('/api/pd')

  const users = rz.map(item => ({
    id: item?.x_profiles?.id,
    avatar: item?.x_profiles?.avatar,
    name: item?.x_profiles?.fullname,
    user_name: item?.x_profiles?.slug,
    refCount: item?.refCount,
  }))

  users.forEach((user, index) => {
    const tierIndex = Math.floor(index / 4)
    if (tiers[tierIndex]) {
      tiers[tierIndex].users.push(user)
    }
  })


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
        <NuxtLink :to="`/topic/u-${user.id}`" v-for="user in tier.users" :key="user.id"
          class="border-0 flex flex-col items-center justify-center relative">
          <van-image class="w-full h-full bg-cover" :src="xAvatar(user.avatar)">
            <template v-slot:loading>
              <van-loading type="spinner" size="20" />
            </template>
          </van-image>
          <p class="leading-5 text-center text-xs border-0 w-full absolute bottom-0 bg-black/10 backdrop-blur-xs">{{
            user.name ||
            'name' }}</p>
        </NuxtLink>
      </div>

    </div>
  </section>
</template>
