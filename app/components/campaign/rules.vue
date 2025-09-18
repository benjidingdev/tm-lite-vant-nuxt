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
  <van-dialog class-name="!bg-[#1F1F1F] !text-white rules-dialog" title="活动规则" width="760" v-model:show="props.visible" @confirm="close">
    <div class="px-7 my-6">
      <div class="px-8 py-4.5 bg-[#FFFFFF1A] rounded-xl">
        <van-row class="text-xl mb-3">
          ✅ 有效掛單標準
        </van-row>
        <p>1、盤口內：</p>
        <li class="ml-6">買單需掛在現價之下</li>
        <li class="ml-6">賣單需掛在現價之上</li>
        <p>2、不可撤單：撤單即視為無效</p>
        <p>3、限價單才算：市價單不參與</p>
      </div>
      <div class="max-h-[40vh] px-8 py-4.5 bg-[#FFFFFF1A] rounded-xl mt-4 overflow-y-auto">
        <van-row class="text-xl mb-3">
          🎯 獎勵計算邏輯
        </van-row>
        <p>獎勵不拼「誰掛得多」，而是拼「誰貢獻更大」。 </p>
        <p>貢獻度由 掛得久、掛得近、掛得多 三個維度綜合評估：</p>
        <p>1️⃣ 掛得久 = 時間加成</p>
        <li class="ml-6">超過 1 小時起算獎勵加成</li>
        <li class="ml-6">掛滿 20 小時，獎勵可提升至 1.5 倍</li>
        <p>2️⃣ 掛得近 = 價格加成</p>
        <li class="ml-6">掛單價格越接近盤口，獎勵越高</li>
        <li class="ml-6">偏離越遠，獎勵遞減</li>
        <li class="ml-6">超出一定區間，將不再獲得獎勵</li>
        <p>3️⃣ 掛得多 = 金額加成</p>
        <li class="ml-6">掛單金額越大，對市場影響越大</li>
        <li class="ml-6">獎勵也會相應提升</li>
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
</style>
