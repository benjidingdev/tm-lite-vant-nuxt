<template>
  <div v-if="false">
    <appkit-button /><button
      :disabled="!walletStore.isConnected"
      @click="todoDisconnect"
    >
      disconnect
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch, ref } from "vue";

// get global store
const { disconnectWallet, walletConected } = $(useWalletStore());
const { loadUserInfo } = $(coreStore());

//disconnect wallet
const todoDisconnect = () => {
  disconnectWallet();
};

onMounted(() => {
  loadUserInfo();
});
</script>
