<script setup lang="ts">
import { userTradeInfo } from "@/api/positions";
import { amountMoney } from "@/utils/processing";
import { multiply } from "@/utils/decimal";
import { onMounted } from "vue";

const { setModal, triggerCallDuration, firstCall } = $(uiStore());
let { order } = $(userStore());

const voState = $ref({
  isLoading: false,
  queryParams: {
    pageNo: 1,
    pageSize: 20,
    orderBy: "created desc",
    key: "",
  },
  total: 0,
});
let marketId = $ref(0);

const showShares = (item) => {
  setModal("share", true);
  marketId = item.marketId;
};

/**
 * load user history orders
 */
const fetchHistoryList = async () => {
  try {
    const res = await userTradeInfo(voState.queryParams);
    if (voState.queryParams.pageNo === 1) {
      order.historyList = res?.data?.list;
    } else {
      order.historyList = order?.historyList?.concat(res.data.list);
    }
    voState.total = res.data.total;
    voState.isLoading = false;
  } catch (error) {
    voState.isLoading = false;
  }
};

const dollars2cents = (value) => {
  return multiply(value, 100);
};

onMounted(() => {
  const isCallNow = triggerCallDuration(Date.now(), 10);
  if (firstCall.history && !isCallNow) {
    return;
  }
  fetchHistoryList();
});
</script>

<template>
  <div class="w-full bg-color-white p-4" v-if="order?.historyList.length !== 0">
    <van-swipe-cell v-for="item in order?.historyList" :key="item.marketId">
      <van-card
        :key="item.marketId"
        :price="
          amountMoney(item.volume || 0) +
          ' shares at ' +
          dollars2cents(item.price || 0) +
          '€'
        "
        :desc="'Buy ' + item.yesName"
        :title="item.question"
        :thumb="item.image"
        class="mt-2"
      >
        <template #footer>
          <van-button plain size="mini" type="primary" @click="showShares(item)"
            >{{ $t("Shares") }}
          </van-button>
        </template>
      </van-card>
      <template #right>
        <van-button square type="primary" text="Trade" />
      </template>
    </van-swipe-cell>
  </div>
</template>
