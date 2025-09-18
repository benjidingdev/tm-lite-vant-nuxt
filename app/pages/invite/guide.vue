<script setup>
const { token } = $(authStore());

definePageMeta({
  layout: "invite",
});
</script>

<template>
  <InviteGuideUserShare class="h-[calc(80dvh)]" v-if="token?.accessToken">
  </InviteGuideUserShare>
  <InviteGuideNoAccount class="h-[calc(80dvh)]" v-else>
  </InviteGuideNoAccount>

  <InviteSkipButton />

</template>
