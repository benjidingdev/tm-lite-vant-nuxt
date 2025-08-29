<script setup lang="ts">
const { modalIsShow } = $(uiStore());
const closeModal = () => {
  modalIsShow.balanceModal = false;
}
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
    <van-tabs>
      <van-tab title="Deposit"><BalanceDeposit @close="closeModal" /></van-tab>
      <van-tab title="Withdraw"><BalanceWithdraw @close="closeModal" /></van-tab>
    </van-tabs>
  </van-dialog>
</template>
