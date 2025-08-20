<script setup lang="ts">
  const { modalIsShow, setModal } = $(uiStore());
  const { tradeVolume, updateVolume } = $(tradeStore())
</script>

<template>
  <van-dialog @confirm="setModal('tradeSetting', false)" v-model:show="modalIsShow.tradeSetting"
    :title="$t('Volume Setting')" :confirmButtonText="$t('Confirm')" :cancelButtonText="$t('Cancel')">
    <div class="text-center px-4 pt-4">
      <div class="align-center mt-4">
        <van-stepper class="w-[40%]" min="1" max="100" v-model="tradeVolume" @change="updateVolume" />
      </div>
      <div class="p-4">
        <van-slider bar-height="4px" class="mt-2" v-model="tradeVolume" @change="updateVolume" />
      </div>
    </div>
  </van-dialog>
</template>
