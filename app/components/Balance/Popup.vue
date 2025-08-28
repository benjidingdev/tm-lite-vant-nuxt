<script setup lang="ts">
const { modalIsShow } = $(uiStore());
</script>

<template>
  <van-dialog
    closeable
    v-model:show="modalIsShow.balanceModal"
    title="Balance"
    :showConfirmButton="false"
    :showCancelButton="false"
    :z-index="50"
  >
    <van-tabs v-model:active="active">
      <van-tab title="Deposit"><BalanceDeposit /></van-tab>
      <van-tab title="Withdraw"><BalanceWithdraw /></van-tab>
    </van-tabs>
  </van-dialog>
</template>
