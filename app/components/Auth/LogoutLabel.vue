<script setup lang="ts">
const { logOut } = $(authStore());
</script>

<template>
  <van-field
    input-align="right"
    readonly
    :label="$t('Logout')"
    @click="logOut"
  />
</template>
