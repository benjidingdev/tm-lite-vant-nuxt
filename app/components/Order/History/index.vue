<script setup lang="ts">
import { userTradeInfo } from "@/api/positions";
import { amountMoney } from "@/utils/processing";
import { multiply } from "@/utils/decimal";
import { onMounted } from "vue";

const { setModal } = $(uiStore());
let { order } = $(userStore());

const queryParams = {
  pageNo: 1,
  pageSize: 20,
  orderBy: "created desc",
  key: "",
};

let marketId = $ref(0);
let isLoading = $ref(true);
let total = $ref(0);

const showShares = (item: any) => {
  setModal("share", true);
  marketId = item.marketId;
};

/**
 * load user history orders
 */
const fetchHistoryList = async () => {
  if (queryParams.pageNo === 1) {
    isLoading = true;
    order.historyList = [];
  }
  try {
    const res = await userTradeInfo(queryParams);
    if (!res.data) {
      return;
    }
    order.historyList = [...order.historyList, ...res.data.list];
    total = res.data.total;
  } catch (error) {}
  isLoading = false;
};

const dollars2cents = (value: number) => {
  return multiply(value, 100);
};

onMounted(() => {
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
  <div v-else>
    <van-empty description="Not Data. Please trade now!" image="search" />
  </div>
</template>
