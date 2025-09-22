<script setup>
definePageMeta({
  layout: "x",
});

const { t } = useI18n()
let { topic } = $(pmDataStore())

const route = useRoute()

const debug = useDebug('rank_' + route.params.id)
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

let isLoading = $ref(true)
async function loadData() {
  isLoading = true
  const rz = await doFetch(`/api/invite/topic?id=${route.params.id}`).catch((err) => {
    console.error('topic-rank-get error', err)
    return
  })

  if (rz?.topic) {
    topic = rz?.topic
  }
  const users = rz?.data?.map(item => ({
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
  console.log('topic-rank', topic, users)
  isLoading = false
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <article class="w-[calc(100dvw-28px)] sm:w-90 m-auto">
    <van-skeleton :loading="isLoading || false">
      <template #template>
        <div class="w-[calc(100dvw-28px)] sm:w-90 h-[100dvh] flex flex-col justify-center items-center ">
          <div :style="{ marginTop: '42px', width: '100%' }">
            <van-skeleton-paragraph row-width="60%" />
            <van-skeleton-paragraph />
            <van-skeleton-paragraph />
            <van-skeleton-paragraph />
          </div>

          <div class="w-full my-10 flex-1 flex justify-center items-center bg-[var(--van-active-color)] rounded-[24px]">
            <van-loading size="48" />
          </div>
        </div>
      </template>
      <TopicHeader :topic />

      <p class="text-center my-4 text-2xl text-[var(--turing-green-color)]">{{ t('Invite Rank Wall') }}</p>
      <section id="share-download" class="w-full h-auto flex flex-col items-center justify-center space-y-[10px] mt-0">
        <div class="flex justify-between items-stretch w-full border-0 border-red-500" v-for="(tier, index) in tiers"
          :key="tier.rank">
          <p class="w-8 leading-20 text-center text-2xl" :style="{ background: tier.bg || 'blue' }">{{ tier.rank }}</p>
          <div class="flex-1 grid grid-cols-4 gap-[1px]">
            <NuxtLink :to="`https://x.com/${user?.user_name}`" v-for="user in tier.users" :key="user.id"
              class="border-0 flex flex-col items-center justify-center relative" target="_blank">
              <XAvatar :src="user.avatar" />
              <p class="leading-5 text-center text-xs border-0 w-full absolute bottom-0 bg-black/10 backdrop-blur-xs">
                {{ user.name || 'name' }}
              </p>
            </NuxtLink>
          </div>
        </div>
      </section>
      <FloatShare />
    </van-skeleton>
  </article>
</template>
