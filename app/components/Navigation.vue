<template>
  <div class="h-20 flex items-center justify-between px-10">
    <div class="flex items-center">
      <van-icon class="text-2xl! text-white" name="balance-o" />
      <span class="text-white">${{ Number(userBalance ?? 0).toFixed(2) }}</span>
    </div>

    <div class="mr-8">
      <appkit-button
        balance="show"
        size="md"
        class="text-white"
        label="Connect"
        loadingLabel="Connecting"
      />
    </div>

    <div
      class="absolute right-5 w-11 h-11 flex flex-col justify-center items-center rounded-full bg-white/20 backdrop-opacity-10 p-3 focus:outline-none"
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

const { walletAddress } = $(useWalletStore());
const { setSettingModalShow } = $(uiStore());
const { userBalance } = $(coreStore());
const { address, isConnected, chainId } = $(useAccount());

// let { data: balance, refetch: refreshBalance } = $(
//   useBalance({
//     address,
//     chainId: chainId,
//     cacheTime: 0,
//     staleTime: 0,
//   })
// );

// const formattedBalance = computed(() => {
//   if (!balance) return "0.000";

//   const value = parseFloat(balance.formatted);
//   return isNaN(value)
//     ? "0.000"
//     : value.toLocaleString(undefined, {
//         minimumFractionDigits: 1,
//         maximumFractionDigits: 1,
//       }) +
//         " " +
//         balance.symbol;
// });

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
