<script setup>
const { token } = $(authStore());
</script>

<template>
  <section class="w-full h-[calc(100dvh-var(--nav-height))] space-y-px overflow-y-scroll">

    <InviteNewUserNotice />

    <InviteAccountShare v-if="token.accessToken" />

    <InviteGuideNoAccount v-else />

    <InviteLeaderBoard />
  </section>
</template>
