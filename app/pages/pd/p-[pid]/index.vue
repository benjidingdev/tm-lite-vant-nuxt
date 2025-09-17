<script setup>

const route = useRoute()
definePageMeta({
  layout: "x",
});

const { hasTwitterLogin, doLogin, x_user } = $(supabaseStore())

async function handleLogin() {
  await doLogin({path: location.pathname})
}

function handleShare() {
  let shareLink = new URL(location.href);
  shareLink.searchParams.append('refId', x_user.id)
  shareLink = shareLink.toString()
  const text = `
  I’m joining the TuringM Prediction Master 🏆🏆🏆🏆🏆

Follow @TuringMarket, @TuringM_CN, RT and LIKE via ${shareLink} to get 1000 testnet $TUIT.

1000 USDT up for grabs!
 `;

  handleRetweet({
    hashtags: 'TuringM,TuringMaster,Airdrop',
    shareTweetStatusLink: 'https://x.com/TuringMarket/status/1958786009753428017',
    text
  })
}

let retweetLink = $ref('')
async function handleSubmit() {
  if (!retweetLink) {
    return
  }

  const rz = await doFetch(`/api/pd/topic/${route.params.pid}`, {
    method: 'POST',
    body: JSON.stringify({
      retweetLink,
      action: 'topic-join',
    })
  })

  console.log({ rz })
  if (rz.data.success) {
    hasRetweeted = true
  }
}

async function handleDel() {
  const rz = await doFetch(`/api/pd/topic/${route.params.pid}`, {
    method: 'POST',
    body: JSON.stringify({
      retweetLink,
      action: 'topic-join_del',
    })
  })

  console.log({ rz })
  if (rz.data.success) {
    hasRetweeted = false
  }
}

const sharedTopic = topics()
const topic = $computed(() => sharedTopic.find(t => t.id === Number(route.params.pid)))


let hasRetweeted = $ref(false)
async function loadData() {
  if (!hasTwitterLogin) {
    return
  }

  const rz = await doFetch(`/api/pd/topic/${route.params.pid}`, {
    method: 'POST',
    body: JSON.stringify({
      retweetLink,
      action: 'topic-join_check',
    })
  })

  console.log({ rz })

  if (rz?.data?.success) {
    hasRetweeted = true
  }
}


let retweetList = $ref([])
async function loadList(params) {
  const rz = await doFetch(`/api/pd/topic/${route.params.pid}`, {
    method: 'POST',
    body: JSON.stringify({
      retweetLink,
      action: 'topic-join_list',
    })
  })

  console.log({ rz })

  if (rz?.data?.success) {
    retweetList = rz.data.data
  }
}

onMounted(() => {
  loadData()
  loadList()
})

</script>

<template>
  <article class="w-full h-full flex flex-col items-center justify-center space-y-8 px-8">
    <h1 class="text-xl font-bold">{{ topic?.title }}</h1>
    <h2 class="text-lg font-bold">Join the Waitlist</h2>

    <template v-if="hasTwitterLogin">
      <template v-if="hasRetweeted">
        <button class="bg-blue-500 text-white px-4 py-2 rounded-md" @click="handleDel">
          hasRetweeted, remove for test
        </button>
      </template>

      <template v-else>


        <section class="w-full flex flex-col items-center justify-center space-y-4 bg-[#200052] p-4 rounded-md">
          <p class="text-gray-300 text-xs">
            First, click the retweet button below to retweet the topic tweet and paste the retweet link below.
          </p>
          <button class="w-full bg-blue-500 text-white px-4 py-2 rounded-md" @click="handleShare">
            retweet
          </button>
        </section>

        <section class="w-full flex flex-col items-center justify-center space-y-4 bg-[#200052] p-4 rounded-md">
          <p class="text-gray-300 text-xs">
            Then, paste the retweet link above and click submit.
          </p>

          <textarea type="text" v-model="retweetLink" class="w-full border p-2 rounded-md"
            placeholder="Enter your retweet link">
        </textarea>
          <button class="w-full bg-blue-500 text-white px-4 py-2 rounded-md" @click="handleSubmit">
            submit
          </button>
        </section>

      </template>
    </template>

    <template v-else>
      <section class="w-full flex flex-col items-center justify-center space-y-4 bg-[#200052] p-4 rounded-md">
        <button class="bg-blue-500 text-white px-4 py-2 rounded-md" @click="handleLogin">
          Authorize access to your X account
        </button>

        <p class="text-center text-gray-500 text-xs">
          Join the TuringM Prediction Master waitlist and get early access to the
          platform.
        </p>
      </section>
    </template>
  </article>
</template>
