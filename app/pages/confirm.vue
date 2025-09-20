<script setup lang="ts">
definePageMeta({
  colorMode: "dark",
  layout: "x",
});

const debug = useDebug('confirm')
const user = useSupabaseUser()

const postInvite = async (refId: string, reason: string) => {
  try {
    const rz = await doFetch('/api/invite/updateRefId', {
      method: 'POST',
      body: {
        refId,
        reason,
      }
    })
    debug({ rz })
  } catch (error) {
    debug({ error })
  }
}

watch(user, async () => {
  if (user.value) {
    const params = new URLSearchParams(location.search);
    let redirectTo = params.get("redirectTo") || '/';
    redirectTo = redirectTo.replace('[uid]', user.value.id)
    const refId = params.get("refId") || '';
    const reason = params.get("reason") || '';
    debug({ refId, reason, user: user.value, redirectTo })
    postInvite(refId, reason)
    return navigateTo(redirectTo)
  }
}, { immediate: true })
</script>

<template>
  <article class="w-full h-full flex flex-col items-center justify-center space-y-8 px-8">
    Redirecting...
  </article>
</template>
