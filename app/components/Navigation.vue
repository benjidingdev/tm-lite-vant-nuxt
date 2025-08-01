<template>
  <div class="h-20 flex items-center justify-between px-10">
    <div class="flex items-center">
      <van-icon class="text-2xl! text-white" name="balance-o" />
      <span class="text-white">{{ formattedBalance }}</span>
    </div>

    <div class="mr-8">
      <appkit-button
        balance="show"
        size="md"
        class="text-white"
        label="Connect"
        loadingLabel="Connecting"
        @click="isToken(true)"
      />
    </div>

    <div
      class="absolute right-5 w-11 h-11 flex flex-col justify-center items-center rounded-full bg-white/20 backdrop-opacity-10 p-3 focus:outline-none"
      @click="openSettingModal"
    >
      <span
        class="block h-0.5 w-6 bg-white transform transition duration-300 ease-in-out"
      ></span>
      <span
        class="block h-0.5 w-5 bg-white mt-1 transform transition duration-300 ease-in-out"
      ></span>
      <span
        class="block h-0.5 w-4 bg-white mt-1 transform transition duration-300 ease-in-out"
      ></span>
    </div>
    <!--setting modal-->
    <SettingModal />
  </div>
</template>

<script setup>
import { useBalance, useAccount } from "@wagmi/vue";
import { mainnet, polygon } from "@wagmi/vue/chains";

const { walletAddress } = $(useWalletStore());
const { setSettingModalShow } = $(uiStore());
const { isToken } = $(authStore());

const { address, isConnected } = $(useAccount());
let { data: balance, refetch: refreshBalance } = $(
  useBalance({
    address,
    // need change it to configuration
    chainId: 31337,
    cacheTime: 0,
    staleTime: 0,
  })
);

const formattedBalance = computed(() => {
  if (!balance) return "0.000";

  const value = parseFloat(balance.formatted);
  return isNaN(value)
    ? "0.000"
    : value.toLocaleString(undefined, {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }) +
        " " +
        balance.symbol;
});

const openSettingModal = () => {
  setSettingModalShow(true);
};

watch(
  () => isConnected,
  (newVal) => {
    refreshBalance();
  },
  { immediate: true }
);
</script>

<style>
wui-flex > wui-text {
  color: white;
}
</style>
