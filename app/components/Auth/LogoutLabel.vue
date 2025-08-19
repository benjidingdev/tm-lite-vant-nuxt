<script setup lang="ts">
const { logOut } = $(authStore());

const triggerLogOut = () => {
  logOut();
};
</script>

<template>
  <van-field
    input-align="right"
    readonly
    :label="$t('TRSetting.Logout')"
    @click="triggerLogOut"
  />
</template>
