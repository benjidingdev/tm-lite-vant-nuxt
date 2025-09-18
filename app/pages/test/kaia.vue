<script setup lang="ts">
import { lineWalletStore } from "~/stores/lineWalletStore";

const account = ref<string | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);

const lineStore = lineWalletStore();

const connectKaiaWallet = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    // 连接并签名
    const [accountAddress] = await lineStore.connectAndSign('connect');
    account.value = accountAddress;
  } catch (err) {
    console.error("Error connecting to Kaia wallet:", err);
    error.value = err instanceof Error ? err.message : "Unknown error occurred";
  } finally {
    isLoading.value = false;
  }
}

const disconnectKaiaWallet = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    await lineStore.disconnect();
    account.value = null;
  } catch (err) {
    console.error("Error disconnecting from Kaia wallet:", err);
    error.value = err instanceof Error ? err.message : "Unknown error occurred";
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div>
    <van-button type="primary" @click="connectKaiaWallet">
      {{ isLoading ? 'Connecting...' : 'Connect Kaia Wallet' }}
    </van-button>
    <van-button v-if="account" type="danger" @click="disconnectKaiaWallet">
      Disconnect
    </van-button>
    <span>Wallet Type: {{  }}</span>
    <div v-if="error" style="color: red;">
      Error: {{ error }}
    </div>
    <div v-if="account">
      <span>Account: {{ account }}</span>
    </div>
  </div>
</template>
