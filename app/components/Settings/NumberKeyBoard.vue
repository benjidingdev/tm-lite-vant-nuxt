<script lang="ts" setup>
const { oneTimePassword } = $(privyStore());
const { keyBoardIsShow, setKeyBoard } = $(uiStore());
</script>
<template>
  <van-number-keyboard
    v-model="oneTimePassword"
    z-index="10000"
    :show="keyBoardIsShow.settings"
    @blur="setKeyBoard('settings', false)"
  />
</template>
