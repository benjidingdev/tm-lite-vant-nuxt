<script setup>
const { token } = $(authStore());
let { fatherInviteCode } = $(userStore());

definePageMeta({
  layout: "invite",
});

onMounted(async () => {
  console.log({fatherInviteCode});
})
</script>

<template>
  <InviteAccountShare v-if="token.accessToken && true" />
  <InviteNoAccount v-else />
</template>
