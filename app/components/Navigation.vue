<script setup>
import { useAppKit } from "@reown/appkit/vue";
import {
  useConnect,
  useDisconnect,
  useAccount,
  useBalance,
  useSignMessage,
} from "@wagmi/vue";

const { msg } = $(useWalletStore());
const { setSettingModalShow } = $(uiStore());
const { isToken } = $(authStore());

const { open } = useAppKit();
const openSettingModal = () => {
  setSettingModalShow(true);
};
</script>

<template>
  <div class="h-20 flex items-center justify-between px-10">
    <h1 class="text-3xl text-white">Prediction</h1>
    <div class="mr-8">
      <!-- <appkit-button /> -->
      <appkit-connect-button
        balance="show"
        size="md"
        label="connect"
        loadingLabel="connecting"
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