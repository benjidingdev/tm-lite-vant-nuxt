<script setup>
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close'])

const close = () => {
  emit('close')
}
</script>
<template>
  <van-dialog class-name="!bg-[#1F1F1F] !text-white rules-dialog" :title="$t('Activity Rules')" width="760" v-model:show="props.visible" @confirm="close">
    <div class="px-7 my-6">
      <div class="px-8 py-4.5 bg-[#FFFFFF1A] rounded-xl">
        <van-row class="text-xl mb-3">
          ✅ {{ $t('Valid Order Standard') }}
        </van-row>
        <p>{{ $t('Valid Order Standard Desc') }}</p>
        <p>1、{{ $t('Must Provide Liquidity') }}</p>
        <li class="ml-6">{{ $t('Bid Orders Standard') }}</li>
        <li class="ml-6">{{ $t('Ask Orders Standard') }}</li>
        <p>2、{{ $t('Do Not Cancel') }}</p>
        <p>3、{{ $t('Limit Orders Only') }}</p>
      </div>
      <div class="max-h-[40vh] px-8 py-4.5 bg-[#FFFFFF1A] rounded-xl mt-4 overflow-y-auto">
        <van-row class="text-xl mb-3">
          🎯 {{ $t('Maximize Harvest') }}
        </van-row>
        <p>{{ $t('Maximize Harvest Desc') }}</p>
        <p>1️⃣ {{ $t('Time Multiplier') }}</p>
        <li class="ml-6">{{ $t('Time Multiplier Desc') }}</li>
        <li class="ml-6">{{ $t('Time Multiplier Desc2') }}</li>
        <p>2️⃣ {{ $t('Precision Multiplier') }}</p>
        <li class="ml-6">{{ $t('Precision Multiplier Desc') }}</li>
        <li class="ml-6">{{ $t('Precision Multiplier Desc2') }}</li>
        <li class="ml-6">{{ $t('Precision Multiplier Desc3') }}</li>
        <p>3️⃣ {{ $t('Size Multiplier') }}</p>
        <li class="ml-6">{{ $t('Size Multiplier Desc') }}</li>
      </div>
    </div>
  </van-dialog>
</template>
<style scoped>
:global(.van-dialog__header) {
  color: #fff;
}
:global(.rules-dialog .van-dialog__confirm .van-button__content) {
  color: #fff;
  background-color: #1F1F1F;
}
::-webkit-scrollbar {
  display: none;
}
</style>
