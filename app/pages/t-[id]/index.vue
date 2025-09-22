<script setup>
const route = useRoute()
definePageMeta({
  layout: "x",
});

let { refreshTime } = $(pmDataStore());
const { hasTwitterLogin } = $(supabaseStore())

let topic = $ref({})
let isLoading = $ref(true)

// const topic = $computed(() => sharedTopic.find(t => t.id === Number(route.params.pid)))

const debug = useDebug('topic')

// 0, check if user has retweeted
let hasRetweeted = $ref(false)
async function checkRetweeted() {
  if (!hasTwitterLogin) {
    return
  }

  const rz = await doFetch(`/api/topic/${route.params.id}`, {
    method: 'POST',
    body: JSON.stringify({
      action: 'topic-join_check',
    })
  }).catch((err) => {
    debug({ msg: 'topic-join_check error', err })
  })

  if (rz?.data?.success) {
    hasRetweeted = true
  }
}

async function loadData() {
  isLoading = true
  const rz = await doFetch(`/api/topic/${route.params.id}`, {
    method: 'POST',
    body: JSON.stringify({
      action: 'topic-get',
    })
  }).catch((err) => {
    debug({ msg: 'topic-get error', err })
  })


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
  <article class="w-[calc(100dvw-28px)] sm:w-90 m-auto flex flex-col items-center justify-center pb-4 border-0">
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

          <div class="w-full mb-10 flex-1 flex justify-center items-center bg-[var(--van-active-color)] rounded-[24px]">
            <van-loading size="48" />
          </div>
        </div>
      </template>
      <TopicHeader :topic="topic" />

      <!--show waitinglist activity and retweet page(include retweet list)-->
      <template v-if="hasTwitterLogin">
        <SwipeCardPDC :topic />
        <TopicWaitListRetweet :topic v-model="hasRetweeted" @onSuccess="() => { refreshTime = new Date() }" />
      </template>

      <!--show twitter login page and retweetlist-->
      <template v-else>
        <TopicWaitListLogin />
      </template>

    </van-skeleton>
  </article>
</template>
