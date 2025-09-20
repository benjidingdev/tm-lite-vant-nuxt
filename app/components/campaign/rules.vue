<script setup>
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close'])
const { t } = useI18n()

const close = () => {
  emit('close')
}
</script>
<template>
  <van-dialog class-name="!bg-[#1F1F1F] !text-white rules-dialog" :title="t('Activity Rules')"
    :confirm-button-text="t('Confirm')" width="760" v-model:show="props.visible" @confirm="close">
    <div class="!max-h-[68vh] px-4 lg:px-7 my-6 overflow-y-auto">
      <div class="px-5 lg:px-8 py-4.5 bg-[#FFFFFF1A] rounded-xl">
        <p class="text-lg lg:text-xl mb-3">✅ {{ t('Valid Order Standard') }}</p>
        <p>{{ t('Valid Order Standard Desc') }}</p>
        <ol>
          <li>{{ t('Must Provide Liquidity') }}</li>
          <ul>
            <li class="ml-6">{{ t('Bid Orders Standard') }}</li>
            <li class="ml-6">{{ t('Ask Orders Standard') }}</li>
          </ul>
          <li>{{ t('Do Not Cancel') }}</li>
          <li>{{ t('Limit Orders Only') }}</li>
        </ol>
      </div>
      <div class="px-5 lg:px-8 py-4.5 bg-[#FFFFFF1A] rounded-xl mt-4">
        <van-row class="text-lg lg:text-xl mb-3">
          🎯 {{ t('Maximize Harvest') }}
        </van-row>
        <p>{{ t('Maximize Harvest Desc') }}</p>
        <van-row>
          <van-col class="pr-1">1️</van-col>
          <van-col>{{ t('Time Multiplier') }}</van-col>
        </van-row>
        <li class="ml-6">{{ t('Time Multiplier Desc') }}</li>
        <li class="ml-6">{{ t('Time Multiplier Desc2') }}</li>
        <van-row>
          <van-col class="pr-1">2️⃣</van-col>
          <van-col class="flex-1">{{ t('Precision Multiplier') }}</van-col>
        </van-row>
        <li class="ml-6">{{ t('Precision Multiplier Desc') }}</li>
        <li class="ml-6">{{ t('Precision Multiplier Desc2') }}</li>
        <li class="ml-6">{{ t('Precision Multiplier Desc3') }}</li>
        <van-row>
          <van-col class="pr-1">3️⃣</van-col>
          <van-col class="flex-1">{{ t('Size Multiplier') }}</van-col>
        </van-row>
        <li class="ml-6">{{ t('Size Multiplier Desc') }}</li>
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

ol {
  list-style-type: decimal;
  padding-left: 20px;
}

ul {
  list-style-type: disc;
}
</style>
<i18n lang="json">{
  "en-US": {
    "Activity Rules": "Activity Rules",
    "Valid Order Standard": "What is a \"Valid Farm Order\"?",
    "Valid Order Standard Desc": "To earn yield, your order must meet these criteria:",
    "Must Provide Liquidity": "Must Provide Liquidity",
    "Bid Orders Standard": "Bid Orders: Must be placed below the last traded price.",
    "Ask Orders Standard": "Ask Orders: Must be placed above the last traded price.",
    "Do Not Cancel": "Do Not Cancel: Canceling an order removes it from the daily farming calculation.",
    "Limit Orders Only": "Limit Orders Only: Market orders are not eligible.",
    "Maximize Harvest": "The Three Pillars of Yield: Maximize Your $TUIT Harvest",
    "Maximize Harvest Desc": "Your rewards are not linear. They are amplified by three key multipliers. Optimize these to maximize your daily harvest.",
    "Time Multiplier": "Time Multiplier (HODL Your Orders)",
    "Time Multiplier Desc": "> 1 hour: Dedication Bonus (> 1.1x)",
    "Time Multiplier Desc2": "≥ 20 hours: Max Bonus (1.5x)",
    "Precision Multiplier": "Precision Multiplier (Sharpshooter Rewards)",
    "Precision Multiplier Desc": "Orders closer to the current market price are deemed more valuable and receive a higher reward weight.",
    "Precision Multiplier Desc2": "Orders too far from the price feed receive a progressively lower weight, eventually decaying to zero.",
    "Precision Multiplier Desc3": "Orders outside a certain price range will not receive any reward.",
    "Size Multiplier": "Size Multiplier (Deep Liquidity Rewards)",
    "Size Multiplier Desc": "Larger order sizes (Order Amount × Price) have a greater impact on market health and are rewarded accordingly.",
    "Confirm": "Confirm"
  },
  "zh-TW": {
    "Activity Rules": "活動規則",
    "Valid Order Standard": "有效掛單標準",
    "Valid Order Standard Desc": "要獲得收益率，您的訂單必須符合以下條件：",
    "Must Provide Liquidity": "盤口內：",
    "Bid Orders Standard": "買單：必須掛在最後成交價以下。",
    "Ask Orders Standard": "賣單：必須掛在最後成交價以上。",
    "Do Not Cancel": "不可撤單：撤單即視為無效。",
    "Limit Orders Only": "限價單僅限有效掛單，市價單不參與。",
    "Maximize Harvest": "獎勵計算邏輯",
    "Maximize Harvest Desc": "獎勵不拼「誰掛得多」，而是拼「誰貢獻更大」。貢獻度由 掛得久、掛得近、掛得多 三個維度綜合評估：",
    "Time Multiplier": "掛得久 = 時間加成",
    "Time Multiplier Desc": "超過 1 小時起算獎勵加成",
    "Time Multiplier Desc2": "掛滿 20 小時，獎勵可提升至 1.5 倍",
    "Precision Multiplier": "掛得近 = 價格加成",
    "Precision Multiplier Desc": "掛單價格越接近盤口，獎勵越高",
    "Precision Multiplier Desc2": "偏離越遠，獎勵遞減",
    "Precision Multiplier Desc3": "超出一定區間，將不再獲得獎勵",
    "Size Multiplier": "掛得多 = 金額加成",
    "Size Multiplier Desc": "掛單金額越大，對市場影響越大，獎勵也會相應提升",
    "Confirm": "確認"
  },
  "ja-JP": {},
  "ko-KR": {}
}</i18n>
