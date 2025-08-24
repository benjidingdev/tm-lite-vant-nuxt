<script setup>
import { computed } from "vue";
import { useBalance, useAccount } from "@wagmi/vue";
import { shortenNumber } from "@/utils/processing";

const { shortWalletAddress, userBalance } = $(walletStore());
const { setModal } = $(uiStore());
const { token } = $(authStore());
const { address, isConnected, chainId } = $(useAccount());

const shortUserBalance = computed(() => {
  return userBalance ? shortenNumber(userBalance) : "0.00";
});

const showloginModal = () => {
  setModal("loginModal", true);
};

watch(
  () => isConnected,
  (newVal) => {
    // refreshBalance();
  },
  { immediate: true }
);
</script>

<template>
  <div class="h-20 flex items-center justify-between px-2">
    <div class="flex items-center flex-1">
      <van-icon class="text-2xl! text-white" name="balance-o" />
      <span class="text-white ml-1">${{ shortUserBalance }}</span>
    </div>

    <div class="flex items-center space-x-2">
      <button
        v-if="token?.accessToken"
        class="px-3 py-1 bg-gray-500/20 rounded-xl transition-colors"
      >
        <div class="flex items-center">
          <img
            class="w-5 h-5 rounded-full mr-2"
            src="https://mallbucket-pub.s3.us-west-1.amazonaws.com/5d91f04442c8d6f585479c37e916596110bdf1cfcbc1d60cfd9d971ae1bf0815.jpg"
            alt=""
          />
          <span class="text-white/80">{{ shortWalletAddress }}</span>
        </div>
      </button>
      <van-button
        size="small"
        v-else
        round
        type="primary"
        class="px-3 text-white/80 right mr-2!"
        @click="showloginModal"
        >{{$t('Login')}}</van-button
      >
      <SettingsVolumeButton />
      <SettingsButton />
    </div>
  </div>
</template>

<style>
wui-flex > wui-text {
  color: white;
}
</style>
