<script setup>
import { computed } from "vue";
import { shortenNumber } from "@/utils/processing";

const { shortWalletAddress } = $(walletStore());
const { setModal } = $(uiStore());
const { token } = $(authStore());

</script>

<template>
  <div>
    <button
      v-if="token?.accessToken"
      class="px-3 py-1 bg-gray-500/20 rounded-xl transition-colors"
      @click="setModal('balanceModal', true)"
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
      @click="setModal('loginModal', true)"
      >{{ $t("Login") }}</van-button
    >
  </div>
</template>

<style></style>
