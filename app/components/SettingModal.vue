<template>
  <van-dialog
    @confirm="closeSettingModal"
    v-model:show="settingModalShow"
    title="Set Shares"
    show-cancel-button
    confirmButtonText="Buy"
    cancelButtonText="Cancel"
  >
    <div class="h-24 items-center">
      <van-field name="stepper" label="Shares">
        <template #input>
          <van-stepper v-model="shares" />
        </template>
      </van-field>
      <van-slider class="mt-2" v-model="shares">
        <template #button>
          <div class="custom-button">{{ shares }}</div>
        </template>
      </van-slider>
    </div>
  </van-dialog>
</template>

<script setup lang="ts">
let { settingModalShow, setSettingModalShow } = $(uiStore());

const closeSettingModal = () => {
  setSettingModalShow(false);
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
