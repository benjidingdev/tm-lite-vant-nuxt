<script setup lang="ts">
  const { auth } = useSupabaseClient()
  const user = useSupabaseUser()

  const twitterIdentity = $computed(() => {
    return user.value?.identities?.find(
      identity => identity.provider === 'twitter'
    )
  })
  const hasTwitterLogin = $computed(() => !!twitterIdentity)

  const doLogin = async () => {
    const { data, error } = await auth.signInWithOAuth({
      provider: 'twitter',
      options: {
        redirectTo: 'http://localhost:3000/confirm',
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
</script>
<template>
  <div class="h-screen px-4">
    <div>
      isLogin: {{ hasTwitterLogin }}
    </div>
    <div v-if="hasTwitterLogin">
      {{ twitterIdentity }}
    </div>
    <van-button v-else type="primary" @click="doLogin">Twitter Login</van-button>
  </div>
</template>
