<script setup lang="ts">
import { useKaiaWalletStore } from "~/stores/kaiaWalletStore";

const kaiaStore = useKaiaWalletStore();

// Initialize Kaia SDK
onMounted(async () => {
  if (kaiaStore.isEnabled && !kaiaStore.isInitialized) {
    await kaiaStore.initialize();
  }
});

// Connect to kaia wallet
const connectKaiaWallet = async () => {
  try {
    if (!kaiaStore.isInitialized) {
      await kaiaStore.initialize();
    }
   const [ account ] = await kaiaStore.connectAndSign('connect');
  } catch (error) {
    console.error("Failed to connect Kaia wallet:", error);
  }
};

// Disconnect kaia wallet
const disconnectKaiaWallet = async () => {
  try {
    await kaiaStore.disconnect();
  } catch (error) {
    console.error("Failed to disconnect Kaia wallet:", error);
  }
};

// Format address display
const formatAddress = (address: string | null) => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};
</script>

<template>
  <button
    v-if="kaiaStore.isEnabled && !kaiaStore.isConnected"
    @click="connectKaiaWallet"
    class="px-3 py-1.5 bg-blue-500/20 rounded-xl transition-colors flex items-center"
    :disabled="kaiaStore.isLoading"
  >
    <span class="text-white/80 text-sm">{{
      kaiaStore.isLoading ? "Connecting..." : "Connect Kaia"
    }}</span>
  </button>
  <div
    v-else-if="kaiaStore.isEnabled && kaiaStore.isConnected"
    class="px-3 py-1 bg-green-500/20 rounded-xl transition-colors flex items-center"
    @click="disconnectKaiaWallet"
  >
    <span class="text-white/80 text-xs">{{
      formatAddress(kaiaStore.account)
    }}</span>
    <span class="text-white/60 text-xs ml-1">{{ kaiaStore.balance }} KAIA</span>
  </div>
</template>
