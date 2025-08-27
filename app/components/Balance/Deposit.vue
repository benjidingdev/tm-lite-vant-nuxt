<script setup lang="ts">
const { userBalance, shortWalletAddress } = $(walletStore());
</script>
<template>
  <van-cell-group>
    <van-notice-bar class="my-2" color="#a7a7a7" background="#f9f9f9" left-icon="balance-pay">
      <span class="font-xs">TuringMarket Balance:${{ userBalance }}</span>
    </van-notice-bar>
    <van-cell title="Wallet Address" :value="shortWalletAddress" />
    <van-cell title="Wallet Address Copy">
      <template #right-icon>
        <van-button size="small" type="primary">Copy</van-button>
      </template>
    </van-cell>
  </van-cell-group>
</template>
