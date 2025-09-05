<script setup lang="ts">
const { session } = $(privyStore());
const { setModal } = $(uiStore());
const { token } = $(authStore());
</script>

<template>
  <div class="h-[calc(100dvh-var(--nav-height))] bg-white overflow-auto">
    <UserInfoCard />
    <OrderList v-if="token.accessToken" />
    <div v-else class="flex justify-center items-center py-20">
      <van-button type="success" @click="setModal('loginModal', true)">{{
        $t("Login First")
      }}</van-button>
    </div>
  </div>
</template>
