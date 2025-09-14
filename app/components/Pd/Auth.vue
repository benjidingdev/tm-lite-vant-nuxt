<script setup>
const client = useSupabaseClient()
const { hasTwitterLogin, x_user } = $(supabaseStore())

const doLogin = async () => {
  const { data, error } = await client.auth.signInWithOAuth({
    provider: 'twitter',
    options: {
      redirectTo: `${location.origin}/confirm?redirectTo=${encodeURIComponent('/pd')}`,
    },
  })
  if (error) {
    console.log('error', error)
  }
  if (data) {
    console.log('data', data)
  }
  if (data?.url) {
    window.location.href = data.url
  }
}

const doLogout = async () => {
  const rz = await client.auth.signOut()
  console.log(rz)
}
</script>

<template>

  <div class="flex items-center justify-center min-h-screen bg-[#07090b] text-white p-4">

    <PdUser :user="x_user" v-if="hasTwitterLogin" />

    <!-- <div v-if="hasTwitterLogin" class="border-0 flex justify-between items-center space-x-2">
    <img :src="twitterIdentity?.identity_data?.avatar_url" alt="">
    <div class="space-y-1">
      <div class="text-2xl">{{ twitterIdentity?.identity_data?.full_name }}</div>
      <div class="text-gray-400 text-xs">{{ twitterIdentity?.identity_data?.email }}</div>
    </div>
    <div class="bg-blue-500 rounded-md px-2" @click="doLogout">logout</div>
  </div> -->
    <template v-else class="flex items-center justify-center min-h-screen bg-[#07090b] text-white p-4">
      <div class="w-full max-w-sm rounded-lg border border-[#1a1b1c] bg-[#111316] p-6 text-center shadow-lg">

        <div class="flex flex-col items-center">
          <svg class="h-8 w-8 fill-current text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              d="M18.9 6.2c.7-.6 1.4-1.2 2-1.9L22 3.3l-1.6-.3c-.6-.1-1.2.2-1.8.6l-1.3.8c-.5.3-1.1.5-1.7.5H16c-1.1 0-2-.9-2-2V1H10v2c0 1.1-.9 2-2 2H6.6c-.6 0-1.2-.2-1.8-.5L3.5 3.3.4 5.4c.7.7 1.4 1.3 2 1.9l.8.8c.4.4.7.9.9 1.5.3.6.4 1.2.4 1.8v.5c0 1.1-.9 2-2 2h-1c-.6 0-1.2.2-1.8.5l-1.3.8c-.5.3-1.1.5-1.7.5H0v1c0 1.1.9 2 2 2h1c.6 0 1.2-.2 1.8-.5l1.3-.8c.5-.3 1.1-.5 1.7-.5h.5c1.1 0 2 .9 2 2v2h4v-2c0-1.1.9-2 2-2h1.4c.6 0 1.2.2 1.8.5l1.3.8c.5.3 1.1.5 1.7.5h.5c1.1 0 2-.9 2-2v-1c0-1.1-.9-2-2-2h-1c-.6 0-1.2.2-1.8.5L18.9 6.2z">
            </path>
          </svg>
          <h1 class="mt-4 text-2xl font-bold">Connect X (Twitter)</h1>
          <p class="mt-1 text-sm text-gray-400">Follow @TuringM and connect your account</p>
        </div>

        <div class="mt-8 text-left">
          <h2 class="text-green-400 font-bold">Quick Steps:</h2>
          <ol class="mt-2 list-none">
            <li class="mt-1 text-sm">1. Click the button below to connect</li>
            <li class="mt-1 text-sm">2. Authorize access to your X account</li>
            <li class="mt-1 text-sm">3. Ensure you follow @MindoAI</li>
          </ol>
        </div>

        <div to="/pd/x" @click="doLogin"
          class="mt-8 w-full rounded-lg bg-green-500 py-3 font-bold text-black flex items-center justify-center space-x-2 transition-transform duration-200 hover:scale-105">
          <svg class="h-5 w-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm4 11h-3v3h-2v-3H8v-2h3V8h2v3h3z"></path>
          </svg>
          <span>Connect X Account</span>
          <svg class="h-4 w-4 fill-current ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M14.5 4L20 9.5 14.5 15 13 13.5 16 10.5H4V8.5H16L13 5.5z"></path>
          </svg>
        </div>

      </div>
    </template>
  </div>
</template>
