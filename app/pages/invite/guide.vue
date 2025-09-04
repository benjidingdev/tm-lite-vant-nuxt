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
    <template #coin>
      <div class="text-center text-[24px] text-orange-500">+10 TUIT</div>
    </template>
  </InviteAccountShare>
  <InviteNoAccount class="h-[calc(100dvh)]" v-else>
    <InviteSkipButton />
  </InviteNoAccount>
</template>
