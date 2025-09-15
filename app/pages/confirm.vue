<script setup lang="ts">
definePageMeta({
  colorMode: "dark",
});

const debug = useDebug('confirm')
const user = useSupabaseUser()

const postInvite = async (refId: string) => {
  try {
    const rz = await doFetch('/api/invite/updateRefId', {
      method: 'POST',
      body: {
        refId,
      }
    })
    debug({ rz })
  } catch (error) {
    debug({ error })
  }
}

watch(user, async () => {
  if (user.value) {
    const params = new URLSearchParams(document.location.search);
    let redirectTo = params.get("redirectTo") || '/';
    redirectTo = redirectTo.replace('[uid]', user.value.id)
    const refId = params.get("refId") || '';
    debug({ refId, user: user.value, redirectTo })
    if (refId) {
      postInvite(refId)
    }
    return navigateTo(redirectTo)
  }
}, { immediate: true })
</script>

<template>

  <UError :error="{
    statusMessage: 'Redirecting...'
  }" />
</template>
