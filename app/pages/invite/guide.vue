<script setup>
const { token } = $(authStore());


definePageMeta({
  layout: "invite",
});

onMounted(async () => {

})
</script>

<template>
  <InviteGuideUserShare class="h-[calc(100dvh)]" v-if="token.accessToken && true">
    <InviteSkipButton />
  </InviteGuideUserShare>
  <InviteGuideNoAccount class="h-[calc(100dvh)]" v-else>
    <InviteSkipButton />
  </InviteGuideNoAccount>
</template>
