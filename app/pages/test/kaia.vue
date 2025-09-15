<script setup lang="ts">
import { useKaiaWalletStore } from "~/stores/kaiaWalletStore";
import { ref } from "vue";

const account = ref<string | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);

const kaiaStore = useKaiaWalletStore();

const connectKaiaWallet = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    // 检查 Kaia 是否启用
    if (!kaiaStore.isEnabled) {
      // 尝试初始化
      const sdk = await kaiaStore.initialize();
      if (!sdk) {
        throw new Error("Failed to initialize Kaia SDK");
      }
    }

    // 连接并签名
    const [accountAddress] = await kaiaStore.connectAndSign('connect');
    account.value = accountAddress;
  } catch (err) {
    console.error("Error connecting to Kaia wallet:", err);
    error.value = err instanceof Error ? err.message : "Unknown error occurred";
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div>
    <button @click="connectKaiaWallet" :disabled="isLoading">
      {{ isLoading ? 'Connecting...' : 'Connect Kaia Wallet' }}
    </button>
    <div v-if="error" style="color: red;">
      Error: {{ error }}
    </div>
    <div v-if="account">
      <span>Account: {{ account }}</span>
    </div>
  </div>
</template>
