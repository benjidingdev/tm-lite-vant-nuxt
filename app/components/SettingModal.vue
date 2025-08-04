<template>
  <van-dialog
    @confirm="onvolumnChange"
    @cancel="closeSettingModal"
    v-model:show="settingModalShow"
    title="volumn"
    show-cancel-button
    confirmButtonText="Set"
    cancelButtonText="Cancel"
  >
    <div class="h-24 items-center px-4">
      <van-stepper
        class="w-[60%]"
        min="1"
        max="100"
        v-model="volumn"
        @change="onvolumnChange"
      />
      <van-slider
        bar-height="4px"
        class="mt-2"
        v-model="volumn"
        @change="onvolumnChange"
      />
    </div>
  </van-dialog>
</template>

<script setup lang="ts">
let { settingModalShow, setSettingModalShow } = $(uiStore());
let { volumn, updateVolumn
 } = $(coreStore());

const closeSettingModal = () => {
  setSettingModalShow(false);
};

const onvolumnChange = (volumn) => {
  updateVolumn(volumn);
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
