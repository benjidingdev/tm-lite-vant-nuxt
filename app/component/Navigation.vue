<script setup>
import SettingModal from "@/component/SettingModal";
import { useAppKit } from "@reown/appkit/vue";
import {
  useConnect,
  useDisconnect,
  useAccount,
  useBalance,
  useSignMessage,
} from "@wagmi/vue";

const { getNonce } = $(useWalletStore());
const { setSettingModalShow } = $(uiStore());
const {
  isConnected,
  address,
  connector,
  chain,
  chainId,
  status,
  isDisconnected,
} = useAccount();
const { data: signedMessage, signMessageAsync } = useSignMessage();
console.log("address", address);

const { open } = useAppKit();
const openSettingModal = () => {
  setSettingModalShow(true);
};
</script>

<template>
  <div class="h-20 flex items-center justify-between px-10">
    <h1 class="text-3xl text-white">Predict</h1>
    <div class="mr-8">
      <van-button
        icon="https://fastly.jsdelivr.net/npm/@vant/assets/user-active.png"
        type="primary"
        @click="open"
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