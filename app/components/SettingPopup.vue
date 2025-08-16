<template>
  <van-popup v-model:show="settingModalShow" position="right" :style="{ width: '80%', height: '100%' }">
    <LangSwitcherLabel />

  </van-popup>
</template>


<script setup lang="ts">
  let { settingModalShow, setSettingModalShow } = $(uiStore());
  let { volume, updateVolume } = $(coreStore());
  const { todoSign } = $(useWalletStore());

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
