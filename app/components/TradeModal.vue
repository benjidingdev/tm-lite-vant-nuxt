<template>
  <van-dialog
    @confirm="closeTradeModal"
    v-model:show="tradeModalShow"
    title="Trade Details"
    show-cancel-button
    confirmButtonText="Buy"
    cancelButtonText="Cancel"
  >
    <div>1111</div>
  </van-dialog>
</template>

<script setup lang="ts">
let { tradeModalShow, setTradeModalShow } = $(uiStore());

const closeTradeModal = () => {
  setTradeModalShow(false);
};

const shares = $ref(50);
const onSharesChange = (value) => {
  console.log("Shares changed to:", value);
  // Here you can handle the change of shares, e.g., save it to a store or send it to an API
};
</script>

<style scoped>
.custom-button {
  width: 26px;
  color: #fff;
  font-size: 10px;
  line-height: 18px;
  text-align: center;
  background-color: var(--van-primary-color);
  border-radius: 100px;
}
</style>
