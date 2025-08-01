<template />

<script setup lang="ts">
import { userConfig } from "~/api/userInfo";

const { updateWalletConfig } = $(useWalletStore());
const loadWalletConfig = async () => {
  try {
    const res = await userConfig();
    if (res.data) {
      // Update the global store with the contract configuration
      updateWalletConfig(res.data);
    }
  } catch (error) {
    console.error("Failed to load contract configuration:", error);
  }
};

onMounted(() => {
  loadWalletConfig();
});
</script>
