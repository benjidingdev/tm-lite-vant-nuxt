<template>
  <div class="h-20 flex items-center justify-between px-2">
    <div class="flex items-center flex-1">
      <van-icon class="text-2xl! text-white" name="balance-o" />
      <span class="text-white ml-1">${{ shortUserBalance }}</span>
    </div>

    <div class="flex items-center space-x-2">
      <button
        v-if="token?.accessToken && isConnected"
        class="px-3 py-1 bg-gray-500/20 rounded-xl transition-colors"
      >
        <div class="flex items-center">
          <img
            class="w-5 h-5 rounded-full mr-2"
            src="https://mallbucket-pub.s3.us-west-1.amazonaws.com/5d91f04442c8d6f585479c37e916596110bdf1cfcbc1d60cfd9d971ae1bf0815.jpg"
            alt=""
          />
          <span class="text-white/80">{{ walletAddress }}</span>
        </div>
      </button>
      <appkit-button
        v-else
        size="md"
        class="text-white"
        label="Login"
        loadingLabel="Connecting"
      />
      <SettingsButton />
    </div>
  </div>
</template>

<script setup>
import { useBalance, useAccount } from "@wagmi/vue";
import { computed } from "vue";
import { shortenNumber } from "@/utils/processing";

const { walletAddress } = $(useWalletStore());
const { setSettingModalShow } = $(uiStore());
const { token } = $(authStore());
const { userBalance } = $(coreStore());
const { address, isConnected, chainId } = $(useAccount());

const shortUserBalance = computed(() => {
  return userBalance ? shortenNumber(userBalance) : "0.00";
});

const openSettingModal = () => {
  setSettingModalShow(true);
};

watch(
  () => isConnected,
  (newVal) => {
    // refreshBalance();
  },
  { immediate: true }
);
</script>

<style>
wui-flex > wui-text {
  color: white;
}
</style>
