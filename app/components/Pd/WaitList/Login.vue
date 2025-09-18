<script setup>
const { doLogin } = $(supabaseStore())

const route = useRoute()
async function handleLogin() {
  const query = new URLSearchParams(location.search)
  const refId = query.get('refId')
  await doLogin({ pathname: location.pathname, refId, reason: `auth.topic-${route.params.pid}` })
}
</script>

<template>
  <section class="w-full flex flex-col items-center justify-center space-y-4 bg-[#200052] p-4 rounded-md">
    <p class="text-center text-gray-500 text-xs">
      Join the TuringM Prediction Master waitlist and get early access to the
      platform.
    </p>

    <button class="w-full bg-blue-500 text-white px-4 py-2 rounded-md" @click="handleLogin">
      Authorize X account
    </button>
  </section>
</template>
