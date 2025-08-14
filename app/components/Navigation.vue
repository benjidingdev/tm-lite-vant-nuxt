<template>
  <div class="h-20 flex items-center justify-between px-6">
    <div class="flex items-center">
      <van-icon class="text-2xl! text-white" name="balance-o" />
      <span class="text-white ml-1">${{ shortUserBalance }}</span>
    </div>

    <div class="mr-8">
      <appkit-button
        size="md"
        class="text-white"
        label="Connect"
        loadingLabel="Connecting"
      />
    </div>

    <div
      class="absolute right-5 w-9 h-9 flex flex-col justify-center items-center rounded-full bg-white/20 backdrop-opacity-10 p-3 focus:outline-none"
      @click="openSettingModal"
    >
      <van-icon name="setting-o" class="text-white text-2xl!" />
    </div>
    <!--setting modal-->
    <SettingModal />
  </div>
</template>

<script setup>
import { useBalance, useAccount } from "@wagmi/vue";
import { computed } from "vue";
import { shortenNumber } from "@/utils/processing";

const { walletAddress } = $(useWalletStore());
const { setSettingModalShow } = $(uiStore());
const { userBalance } = $(coreStore());
const { address, isConnected, chainId } = $(useAccount());

const shortUserBalance = computed(() => {
  return userBalance
    ? shortenNumber(userBalance)
    : "0.00";
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
