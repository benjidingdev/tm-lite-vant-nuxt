<script setup>
const route = useRoute()
definePageMeta({
  layout: "x",
});

let refreshTime = $ref(new Date())
const { hasTwitterLogin, doLogout } = $(supabaseStore())

const sharedTopic = topics()
const { query } = $(useRoute());

let topic = $ref({})
let isLoading = $ref(false)

// const topic = $computed(() => sharedTopic.find(t => t.id === Number(route.params.pid)))

async function handleDel() {
  const rz = await doFetch(`/api/pd/topic/${route.params.pid}`, {
    method: 'POST',
    body: JSON.stringify({
      action: 'topic-join_del',
    })
  })

  // console.log({ rz })
  if (rz.data.success) {
    hasRetweeted = false
    refreshTime = new Date()
    doLogout()
  }
}

// 0, check if user has retweeted
let hasRetweeted = $ref(false)
async function checkRetweeted() {
  if (!hasTwitterLogin) {
    return
  }

  const rz = await doFetch(`/api/pd/topic/${route.params.pid}`, {
    method: 'POST',
    body: JSON.stringify({
      action: 'topic-join_check',
    })
  })

  if (rz?.data?.success) {
    hasRetweeted = true
  }
}

async function loadData() {
  isLoading = true
  const rz = await doFetch(`/api/pd/topic/${route.params.pid}`, {
    method: 'POST',
    body: JSON.stringify({
      action: 'topic-get',
    })
  })

  // console.log('topic-get', rz)

  if (rz?.data?.topic) {
    topic = rz.data.topic
  }
  checkRetweeted()
  isLoading = false
}

onMounted(() => {
  loadData()
})

</script>

<template>
  <article class="max-w-sm m-auto flex flex-col items-center justify-center px-7 border-0">
    <van-skeleton :loading="isLoading">
      <template #template>
        <div class="w-[calc(100dvw-28px)] h-[80vh] flex flex-col justify-center items-center ">
          <div class="w-full h-[70vw] flex justify-center items-center bg-[var(--van-active-color)] rounded-[24px]">
            <van-loading size="48" />
          </div>

          <!-- <van-skeleton-image /> -->
          <div :style="{ marginTop: '42px', width: '100%' }">
            <van-skeleton-paragraph row-width="60%" />
            <van-skeleton-paragraph />
            <van-skeleton-paragraph />
            <van-skeleton-paragraph />
          </div>
        </div>
      </template>

      <img :src="topic?.meta?.logo" alt="" class="w-30 my-10">
      <p class="text-[30px] font-900 leading-[1.2]">{{ topic?.title }}</p>
      <!-- <h2 class="text-lg font-bold">{{ hasRetweeted ? 'You are on the Waitlist' : 'Join the Waitlist' }}</h2> -->

      <template v-if="hasTwitterLogin">
        <div v-if="query.showMarket === 'true'"
          class="w-full h-[calc(100dvh-200px)] flex flex-col justify-center items-center">
          <SwipeCardPDC />
        </div>
        <div v-else>
          <template v-if="hasRetweeted">
            <!-- <button class="bg-red-500 text-white px-4 py-2 rounded-md" @click="handleDel">
            hasRetweeted, remove for test
          </button> -->
            <!-- <PdWaitListRetweet :hasRetweeted /> -->
            <PdWaitListRetweet :topic v-model="hasRetweeted" @onSuccess="() => { refreshTime = new Date() }" />
          </template>
        </div>

      </template>

      <PdWaitListLogin v-else />

      <PdWaitListRetweetList :refreshTime />
    </van-skeleton>
  </article>
</template>
