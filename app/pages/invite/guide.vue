<script setup>
const { token } = $(authStore());
let { fatherInviteCode } = $(userStore());

definePageMeta({
  layout: "invite",
});

onMounted(async () => {
  console.log({ fatherInviteCode });
})
</script>

<template>
  <InviteAccountShare class="h-[calc(100dvh)]" v-if="token.accessToken && true">
    <InviteSkipButton />
  </InviteAccountShare>
  <InviteNoAccount class="h-[calc(100dvh)]" v-else>
    <InviteSkipButton />
  </InviteNoAccount>
</template>
