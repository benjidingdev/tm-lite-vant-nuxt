<script setup>
const { token } = $(authStore());
</script>

<template>
  <section class="w-full h-[calc(100dvh-var(--nav-height))] space-y-px overflow-y-scroll">

    <InviteNewUserNotice />

    <template v-if="token.accessToken  && true">
      <InviteAccountShare />
      <InviteLeaderBoard />
    </template>


    <InviteGuideNoAccount v-else />

  </section>
</template>
