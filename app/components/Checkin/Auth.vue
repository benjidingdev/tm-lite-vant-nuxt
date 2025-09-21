<script setup lang="ts">
const { hasTwitterLogin, doLogin } = $(supabaseStore())

async function handleLogin() {
  const query = new URLSearchParams(location.search)
  const refId = query.get('refId')
  await doLogin({ pathname: location.pathname, refId, reason: `wl.topic-2` })
}
</script>

<template>
  <div v-if="!hasTwitterLogin">
    <van-button class="w-full" type="primary" @click="handleLogin">
      Authorize X account
    </van-button>
  </div>
</template>
