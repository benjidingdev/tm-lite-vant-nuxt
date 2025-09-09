<script setup lang="ts">
import { multiply } from "@/utils/decimal";


let { modalIsShow } = $(uiStore());
let { failCards, requestCount } = $(requestQueueStore());

function handleRemove(i) {
  failCards.splice(i, 1);
  requestCount--;
}
</script>

<template>
  <van-popup position="bottom" v-model:show="modalIsShow.requestQueueErrorModal" round safe-area-inset-bottom
    :style="{ height: '80%' }">
    <article class="w-full h-full flex justify-center items-center flex-col ">
      <div class="w-full text-center text-[18px] py-3 font-[700]">{{ $t("Request Queue Error") }}</div>

      <div class="flex-1 overflow-y-scroll">
        <template v-if="failCards.length > 0">
          <van-swipe-cell class="w-full" v-for="item in failCards" :key="item.marketId">
            <van-card currency="" :key="item.id" :price="multiply(item.transaction.textPrice || 0, 100) + '€'"
              :desc="item.transaction.type == 1 ? 'Buy ' : 'Sell '" :title="item.title" :thumb="item.image" class="my-1">
              <template #footer>
                <span class="text-red-500">
                  {{ item.error?.message || 'Unknown error' }}
                </div>
                <van-button square size="mini" type="danger" :text="$t('Clear')" @click="handleRemove(i)" />
              </div>
            </template>
          </van-card>
        </template>

        <div v-else class="w-full h-full flex items-center">{{ $t('No Error Yet') }}</div>
      </div>

    </article>
  </van-popup>
</template>

<i18n lang="json">{
  "en-US": {
    "Clear": "Clear"
  },
  "zh-TW": {
    "Clear": "清除"
  },
  "ja-JP": {
    "Clear": "クリア"
  },
  "ko-KR": {
    "Clear": "지우기"
  }
}</i18n>
