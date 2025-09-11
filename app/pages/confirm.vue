<script setup lang="ts">
definePageMeta({
  colorMode: "dark",
});
const user = useSupabaseUser()

watch(user, () => {
  if (user.value) {
    const params = new URLSearchParams(document.location.search);
    const redirectTo = params.get("redirectTo") || '/';
    return navigateTo(redirectTo)
  }
}, { immediate: true })
</script>

<template>

  <UError :error="{
    statusMessage: 'Redirecting...'
  }" />
</template>
