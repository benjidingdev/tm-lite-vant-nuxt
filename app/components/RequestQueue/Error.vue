<script setup lang="ts">
import { multiply } from "@/utils/decimal";


let { modalIsShow, setModal } = $(uiStore());
let { failCards } = $(requestQueueStore());

const close = () => {
  setModal("requestQueueErrorModal", false);
};
</script>

<template>
  <van-popup position="bottom" v-model:show="modalIsShow.requestQueueErrorModal" round safe-area-inset-bottom
    :style="{ height: '80%' }">
    <article class="w-full h-full flex justify-center items-center flex-col ">
      <div class="w-full text-center text-[18px] py-3 font-[700]">{{ $t("Request Queue Error") }}</div>

      <div class="flex-1 overflow-y-scroll">
        <template  v-if="failCards.length > 0">
          <van-swipe-cell v-for="item in failCards" :key="item.marketId">
            <van-card currency="" :key="item.id" :price="multiply(item.transaction.textPrice || 0, 100) + '€'"
              :desc="item.transaction.type == 1 ? 'Buy ' : 'Sell '" :title="item.title" :thumb="item.image" class="my-1">
              <template #footer>
                <span class="text-red-500">
                  {{ item.error?.message || 'Unknown error' }}
                </span>
              </template>
            </van-card>
            <template #right>
              <van-button square type="danger" :text="$t('Close')" @click="" />
            </template>
          </van-swipe-cell>
        </template>

        <div v-else class="w-full h-full flex items-center">{{ $t('No Error Yet') }}</div>
      </div>

    </article>
  </van-popup>
</template>
