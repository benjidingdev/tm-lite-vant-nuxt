a
<script setup lang="ts">
import { userOrderList } from "@/api/positions";
import { formatTitle } from "@/utils/processing";
import { multiply } from "@/utils/decimal";
import { onMounted } from "vue";

const { setModal, triggerCallDuration, firstCall } = $(uiStore());
let { order } = $(userStore());

// let openOrderList = $ref([]);
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
 * load user open orders
 */
const fetchOpenOrderList = async () => {
  try {
    const res = await userOrderList(voState.queryParams);
    if (voState.queryParams.pageNo === 1) {
      order.openOrderList = res.data.list;
    } else {
       order.openOrderList =  order?.openOrderList?.concat(res.data.list);
    }
    voState.total = res.data.total;
    voState.isLoading = false;
    firstCall.openOrder = true;
  } catch (error) {
    voState.isLoading = false;
  }
};

onMounted(() => {
  const isCallNow = triggerCallDuration(Date.now(), 10);
  if (firstCall.openOrder && !isCallNow) {
    return;
  }
  fetchOpenOrderList();
});
</script>

<template>
  <div
    class="w-full bg-color-white p-4 overflow-auto"
    v-if="order?.openOrderList.length !== 0"
  >
    <van-swipe-cell v-for="item in order?.openOrderList" :key="item.marketId">
      <van-card
        currency=""
        :key="item.marketId"
        :price="multiply(item.price || 0, 100) + '€'"
        :desc="item.orderType == 1 ? 'Buy' : 'Sell' + item.typeName"
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
        <van-button square type="danger" text="BUY NO" />
        <van-button square type="primary" text="BUY YES" />
      </template>
    </van-swipe-cell>
  </div>
</template>
