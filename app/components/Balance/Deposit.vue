<script setup lang="ts">
const { userBalance, shortWalletAddress } = $(walletStore());
</script>
<template>
  <van-cell-group>
    <van-cell>
      <div class="w-full text-center">
        TuringMarket Balance: ${{ userBalance }}
      </div>
    </van-cell>
    <van-cell title="Wallet Address" :value="shortWalletAddress" />
    <van-cell title="Wallet Address Copy">
      <template #right-icon>
        <van-button size="small" type="primary">Copy</van-button>
      </template>
    </van-cell>
  </van-cell-group>
</template>