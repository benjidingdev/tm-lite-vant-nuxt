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
import { useRoute } from "vue-router";
import { useAppKit } from "@reown/appkit/vue";
import { useAccount } from "@wagmi/vue";

// get global store
const route = useRoute();
// const walletStore = useWalletStore();
const { loadUserInfo, disconnectWallet, walletConected } = $(useWalletStore());
const { token, tokenShow, updateSign } = $(authStore());
const { open } = useAppKit();
const account = useAccount();

//listen the change of the popup state
watch(
  () => tokenShow,
  (val) => {
    if (!val) return;
    if (!token.accessToken) {
      updateSign(false);
      if (walletConected) {
        todoSign();
      } else {
        open();
      }
    }
  },
  { immediate: true }
);

//start login signature
const todoSign = async () => {
  const res = await walletStore.getNonce(walletStore.address);
  if (res) {
    let signMsg = await walletStore.signLoginMessage(res.data);
    walletStore.todoLogin(signMsg, "wallet");
  }
};

//disconnect wallet
const todoDisconnect = () => {
  disconnectWallet();
};

//This function is called when the component is mounted
const initUserInfo = () => {
  loadUserInfo();
};


onMounted(() => {
  initUserInfo();
});
</script>
