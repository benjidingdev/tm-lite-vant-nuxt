<script setup>
const { token } = $(authStore());
</script>

<template>
  <section class="w-full h-[calc(100dvh-var(--nav-height))] space-y-px overflow-y-scroll">


    <template v-if="token.accessToken  && true">
      <InviteNewUserNotice />
      <InviteShareCard />
      <InviteLeaderBoard />
    </template>


    <InviteGuideNoAccount v-else />

  </section>
</template>
