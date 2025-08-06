<template>
  <van-dialog
    @confirm="onvolumeChange"
    @cancel="closeSettingModal"
    v-model:show="settingModalShow"
    title="volume"
    show-cancel-button
    confirmButtonText="Set"
    cancelButtonText="Cancel"
  >
    <div class="h-24 items-center px-4">
      <van-stepper
        class="w-[60%]"
        min="1"
        max="100"
        v-model="volume"
        @change="onvolumeChange"
      />
      <van-slider
        bar-height="4px"
        class="mt-2"
        v-model="volume"
        @change="onvolumeChange"
      />
    </div>
  </van-dialog>
</template>

<script setup lang="ts">
let { settingModalShow, setSettingModalShow } = $(uiStore());
let { volume, updateVolume } = $(coreStore());

const closeSettingModal = () => {
  setSettingModalShow(false);
};

const onvolumeChange = (volume) => {
  updateVolume(volume);
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
