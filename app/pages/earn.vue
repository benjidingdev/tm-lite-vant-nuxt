<script setup>

const { token } = $(authStore());
const { setModal } = $(uiStore());

</script>

<template>
  <!--earn dashboard-->
  <div class="h-[calc(100dvh-var(--nav-height))] inset pt-4">
    <Task class="rounded-xl" v-if="token.accessToken" />
    <div v-else class="flex justify-center items-center py-20">
      <van-button type="success" @click="setModal('loginModal', true)">{{
        $t("Login First")
      }}</van-button>
    </div>
  </div>
</template>
