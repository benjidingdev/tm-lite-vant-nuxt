<script setup lang="ts">
import { userHoldInfoList } from "@/api/positions";
import { onMounted } from "vue";

const { setModal } = $(uiStore());
let { order } = $(userStore());

const queryParams = {
    pageNo: 1,
    pageSize: 20,
    orderBy: "created desc",
    key: "",
  }

let marketId = $ref(0);
let isLoading = $ref(true);
let total = $ref(0);

const showShares = (item: any) => {
  setModal("share", true);
  marketId = item.marketId;
};

const fetchUserHoldInfoList = async () => {
  if (queryParams.pageNo === 1) {
    isLoading = true;
    order.positionList = [];
  }
  try {
    const res = await userHoldInfoList(queryParams);
    if (!res.data) {
      return;
    }

    order.positionList = [...order.positionList, ...res.data.list];
    total = res.data.total;
  } catch (error) {
    console.error(error);
  }
  isLoading = false;
};

onMounted(() => {
  fetchUserHoldInfoList();
  // console.log(order.positionList);
});
</script>

<template>
  <div class="w-full bg-color-white p-4 overflow-auto" v-if="order?.positionList.length !== 0">
    <van-swipe-cell v-for="item in order?.positionList" :key="item.marketId">
      <van-card currency="$" :key="item.marketId" :price="item.profit + '(' + item.profitRate + '%)'"
        :desc="item.description" :title="item.question" :thumb="item.image" class="mt-2">
        <template #footer>
          <van-button plain size="mini" type="primary" @click="showShares(item)">{{ $t("Shares") }}
          </van-button>
        </template>
      </van-card>
      <template #right>
        <van-button square type="primary" text="Trade" @click="setModal('showTradePicker', true)" />
      </template>
    </van-swipe-cell>
  </div>
</template>
