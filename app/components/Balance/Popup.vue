<script setup lang="ts">
  const { modalIsShow } = $(uiStore());
  const closeModal = () => {
    modalIsShow.balanceModal = false;
  }
</script>

<template>
  <van-dialog closeable v-model:show="modalIsShow.balanceModal" :title="$t('Balance')" :showConfirmButton="false"
    :showCancelButton="false" :z-index="50">
    <van-tabs>
      <van-tab :title="$t('Deposit')">
        <BalanceDeposit @close="closeModal" />
      </van-tab>
      <van-tab :title="$t('Withdraw')">
        <BalanceWithdraw @close="closeModal" />
      </van-tab>
    </van-tabs>
  </van-dialog>
</template>
