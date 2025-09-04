<script setup lang="ts">
definePageMeta({
  colorMode: "dark",
});
const user = useSupabaseUser()

watch(user, () => {
  if (user.value) {
    return navigateTo('/')
  }
}, { immediate: true })
</script>

<template>
 
  <UError
    :error="{
      statusMessage: 'Redirecting...'
    }"
  />
</template>
