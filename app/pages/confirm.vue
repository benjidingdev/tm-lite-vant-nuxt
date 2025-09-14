<script setup lang="ts">
definePageMeta({
  colorMode: "dark",
});
const user = useSupabaseUser()

watch(user, () => {
  if (user.value) {
    const params = new URLSearchParams(document.location.search);
    const redirectTo = params.get("redirectTo") || '/';
    const refId = params.get("refId") || '';
    if (refId) {
      console.log(user.value, refId)
      // TODO bind refId to db
      return navigateTo(`${redirectTo.replace('[uid]', user.value.id)}?refId=${refId}`)
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
