<script setup lang="ts">
import { userTradeInfo } from "@/api/positions";
import { amountMoney } from "@/utils/processing";
import { multiply } from "@/utils/decimal";
import { onMounted } from "vue";

const { setModal } = $(uiStore());

let historyList = $ref([]);
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
      historyList = res?.data?.list;
    } else {
      historyList = historyList.concat(res.data.list);
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
  fetchHistoryList();
});
</script>

<template>
  <div class="w-full bg-color-white p-4" v-if="historyList.length !== 0">
    <van-swipe-cell v-for="item in historyList" :key="item.marketId">
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
