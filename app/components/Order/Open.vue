a
<script setup lang="ts">
import { userOrderList } from "@/api/positions";
import { formatTitle } from "@/utils/processing";
import { multiply } from "@/utils/decimal";
import { onMounted } from "vue";

const { setModal } = $(uiStore());

let openOrderList = $ref([]);
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
      openOrderList = res.data.list;
    } else {
      openOrderList = openOrderList.concat(res.data.list);
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
  fetchOpenOrderList();
});
</script>

<template>
  <div
    class="w-full bg-color-white p-4 h-[calc(100vh-80px-264px-50px)] overflow-auto"
    v-if="openOrderList.length !== 0"
  >
    <van-card
      v-for="item in openOrderList"
      currency=""
      :key="item.marketId"
      :price="dollars2cents(item.price || 0) + '€'"
      :desc="item.orderType == 1 ? 'Buy' : 'Sell' + item.typeName"
      :title="item.question"
      :thumb="item.image"
    >
      <template #footer>
        <van-button plain size="mini" type="primary" @click="showShares(item)"
          >{{ $t("Shares") }}
        </van-button>
      </template>
    </van-card>
  </div>
</template>
