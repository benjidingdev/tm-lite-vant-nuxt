<script setup lang="ts">
import { userHoldInfoList } from "@/api/positions";
import { formatTitle } from "@/utils/processing";
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

const fetchUserHoldInfoList = async () => {
  const res = await userHoldInfoList(voState.queryParams);
  if (voState.queryParams.pageNo === 1 && res?.data) {
    order.positionList = res?.data?.list;
  } else {
    order.positionList = order?.positionList?.concat(res?.data?.list);
  }
  voState.total = res?.data?.total;
  voState.isLoading = false;
  firstCall.position = true;
};

onMounted(() => {
  const isCallNow = triggerCallDuration(Date.now(), 10);
  if (firstCall.position && !isCallNow) {
    return;
  }
  fetchUserHoldInfoList();
});
</script>

<template>
  <div
    class="w-full bg-color-white p-4 overflow-auto"
    v-if="order?.positionList.length !== 0"
  >
    <van-swipe-cell v-for="item in order?.positionList" :key="item.marketId">
      <van-card
        currency="$"
        :key="item.marketId"
        :price="item.profit + '(' + item.profitRate + '%)'"
        :desc="item.description"
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
          text="Trade"
          @click="setModal('showTradePicker', true)"
        />
      </template>
    </van-swipe-cell>
  </div>
</template>
