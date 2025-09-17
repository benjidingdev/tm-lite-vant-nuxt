<script setup>
const route = useRoute()
definePageMeta({
  layout: "x",
});

let refreshTime = $ref(new Date())
const { hasTwitterLogin, doLogout } = $(supabaseStore())

const sharedTopic = topics()
const topic = $computed(() => sharedTopic.find(t => t.id === Number(route.params.pid)))

// 2 share
let hasRetweetClicked = $ref(false)

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
async function loadData() {
  if (!hasTwitterLogin) {
    return
  }

  const rz = await doFetch(`/api/pd/topic/${route.params.pid}`, {
    method: 'POST',
    body: JSON.stringify({
      action: 'topic-join_check',
    })
  })

  // console.log('topic-join_check', rz.data)

  if (rz?.data?.success) {
    hasRetweeted = true
  }
}

onMounted(() => {
  loadData()
})

</script>

<template>
  <article class="w-full h-full flex flex-col items-center justify-center space-y-8 px-8">
    <h1 class="text-xl font-bold">{{ topic?.title }}</h1>
    <h2 class="text-lg font-bold">{{ hasRetweeted ? 'You are on the Waitlist' : 'Join the Waitlist' }}</h2>

    <template v-if="hasTwitterLogin">
      <template v-if="hasRetweeted">
        <button class="bg-blue-500 text-white px-4 py-2 rounded-md" @click="handleDel">
          hasRetweeted, remove for test
        </button>
        <PdWaitListRetweet :hasRetweeted />
      </template>

      <template v-else>
        <PdWaitListSubmitRetweetUrl @handleSuccess="() => { hasRetweeted = true; refreshTime = new Date() }"
          @handleBack="() => { hasRetweetClicked = false }" v-if="hasRetweetClicked" />
        <PdWaitListRetweet @handleClick="() => { hasRetweetClicked = true }" v-else />
      </template>
    </template>

    <PdWaitListLogin v-else />

    <PdWaitListRetweetList :refreshTime />
  </article>
</template>
