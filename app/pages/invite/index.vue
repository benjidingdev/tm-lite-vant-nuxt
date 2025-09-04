<script setup>
const { token } = $(authStore());
const { userInfo } = $(userStore());
</script>

<template>
  <section class="w-full h-[calc(100dvh-var(--nav-height))] space-y-px overflow-y-scroll">

    <InviteNewUserNotice />

    <template v-if="token.accessToken">
      <InviteAccountShare class="h-[calc(70dvh-var(--nav-height))]">
        <template #coin>
          <InviteUserCoinBalance />
        </template>
      </InviteAccountShare>

      <InviteUserList />
    </template>

    <InviteNoAccount v-else />

    <InviteLeaderBoard />
  </section>
</template>
