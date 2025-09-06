a
<script setup lang="ts">
import { userOrderList } from "@/api/positions";
import { showToast } from "vant";
import { multiply } from "@/utils/decimal";
import { onMounted } from "vue";
import { cancelUserOrder } from "@/api/markets";

const { setModal } = $(uiStore());
let { order } = $(userStore());

const queryParams = {
  pageNo: 1,
  pageSize: 20,
  orderBy: "created desc",
  key: "",
};

let isLoading = $ref(true);
let total = $ref(0);
let marketId = $ref(0);

const showShares = (item: any) => {
  setModal("share", true);
  marketId = item.marketId;
};

/**
 * load user open orders
 */
const fetchOpenOrderList = async () => {
  if (queryParams.pageNo === 1) {
    isLoading = true;
    order.openOrderList = [];
  }
  try {
    const res = await userOrderList(queryParams);
    if (!res.data) {
      return;
    }

    order.openOrderList = [...order.openOrderList, ...res.data.list];
    total = res.data.total;
  } catch (error) {
    console.error(error);
  }
  isLoading = false;
};

const cancelOrder = async (orderId: number) => {
  showToast("Cancelling the order...");
  try {
    let res = await cancelUserOrder({ orderId: orderId });
    if (res) {
      await fetchOpenOrderList();
      showToast({
        type: "success",
        message: `The order ${orderId} has been cancelled`,
      });
    }
  } catch (e) {}
};

onMounted(() => {
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
        :desc="
          item.orderType == 1 ? `Buy ${item.typeName}` : `Sell ${item.typeName}`
        "
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
        <van-button
          square
          type="primary"
          text="Cancel"
          @click="cancelOrder(item.orderId)"
        />
      </template>
    </van-swipe-cell>
  </div>
</template>
