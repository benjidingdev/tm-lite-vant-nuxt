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

const getRank = async () => {
  const rz = await doFetch('/api/invite/rank', {
    method: 'GET',
  })
  debug({ rz })
}

async function loadData() {
  const rz = await $fetch('/api/pd')
  console.log(rz, supabseUser)

  const users = rz.map(item => ({
    id: item?.id,
    avatar: item?.avatar,
    name: item?.fullname,
    user_name: item?.slug
  }))

  users.forEach((user, index) => {
    const tierIndex = Math.floor(index / 4)
    if (tiers[tierIndex]) {
      tiers[tierIndex].users.push(user)
    }
  })


}

onMounted(() => {
  // loadData()
  getRank()
})
</script>

<template>
  <p class="text-4xl w-full text-center mt-8 sticky top-0 z-1 bg-black">Tier Rank Wall</p>

  <section class="w-full h-[calc(100dvh)] h-auto flex flex-col items-center justify-center space-y-[10px] mt-8">
    <div class="flex justify-between items-stretch w-full border-0 border-red-500" v-for="(tier, index) in tiers"
      :key="tier.rank">

      <p class="w-8 leading-20 text-center text-2xl" :style="{ background: tier.bg || 'blue' }">{{ tier.rank }}</p>

      <div class="flex-1 grid grid-cols-4 gap-[1px]">
        <NuxtLink :to="`/pd/u-${user.id}`" v-for="user in tier.users" :key="user.id"
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

        <!-- <NuxtLink v-if="index >= 3" :to="`/pd/t-${tier.rank}`"
          class="border-0 flex flex-col items-center justify-center">
          <p class="border-0 w-full flex items-center justify-center">
            <span class="border-0 mb-[2px] leading-10">more</span>
            <van-icon name="arrow" />
          </p>
        </NuxtLink> -->
      </div>

    </div>

    <!-- <NuxtLink to="/pd/guid"
      class="fixed bottom-[5vh] right-[5vw] size-10 rounded-full border border-white overflow-hidden flex justify-center items-center bg-white">
      <img v-if="hasTwitterLogin && true" :src="twitterIdentity?.identity_data?.avatar_url" alt=""></img>
      <div v-else>
        <van-icon name="share-o" color="red" size="24" />
      </div>
    </NuxtLink> -->
  </section>
</template>
