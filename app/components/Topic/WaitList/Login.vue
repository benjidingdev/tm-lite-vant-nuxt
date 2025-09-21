<script setup>
const { doLogin } = $(supabaseStore())

const route = useRoute()
async function handleLogin() {
  const query = new URLSearchParams(location.search)
  const refId = query.get('refId')
  await doLogin({ pathname: location.pathname, refId, reason: `topic-${route.params.id}` })
}
</script>

<template>
  <section class="mt-20 w-full flex flex-col items-center justify-center space-y-4 py-4 rounded-md">
    <button class="w-full bg-blue-500 text-white px-4 py-2 rounded-[8px] bg-[#7000FF]" @click="handleLogin">
      Authorize X account
    </button>

    <p class="text-center text-gray-500 text-xs mt-0">
      Join the TuringM Prediction Master waitlist and get early access to the
      platform.
    </p>
  </section>
  <TopicWaitListRetweetList />
</template>
