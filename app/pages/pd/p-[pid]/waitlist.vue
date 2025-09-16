<script setup>

const route = useRoute()
definePageMeta({
  layout: "x",
});

const { hasTwitterLogin, doLogin, x_user } = $(supabaseStore())

async function handleLogin() {
  await doLogin()
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

  const rz = await doFetch(`/api/pd/topic-${route.params.pid}`, {
    method: 'POST',
    body: JSON.stringify({
      retweetLink,
      action: 'add-topic',
    })
  })

  console.log(rz)
}

</script>

<template>
  <article class="w-full h-full flex flex-col items-center justify-center space-y-8 px-8">
    <h1 class="text-3xl font-bold">Waitlist</h1>
    <h2 class="text-2xl font-bold">Join the Waitlist</h2>

    <template v-if="hasTwitterLogin">
      <button class="bg-blue-500 text-white px-4 py-2 rounded-md" @click="handleShare">
        retweet
      </button>
      <p class="text-center text-gray-500 text-xs">
        Please login with your X account to join the waitlist.
      </p>
      <input type="text" class="border roudned-md" placeholder="Enter your X username">
      <button class="bg-blue-500 text-white px-4 py-2 rounded-md" @click="handleSubmit">
        submit
      </button>
    </template>

    <template v-else>
      <button class="bg-blue-500 text-white px-4 py-2 rounded-md" @click="handleLogin">
        Authorize access to your X account
      </button>

      <p class="text-center text-gray-500 text-xs">
        Join the TuringM Prediction Master waitlist and get early access to the
        platform.
      </p>
    </template>
  </article>
</template>
