<script setup lang="ts">
import { userHoldInfoList } from "@/api/positions";
import { onMounted } from "vue";
import { multiply } from "@/utils/decimal";
import {
  amountMoney,
  formatResultPrice,
  formatTitle,
} from "@/utils/processing";

const { setModal } = $(uiStore());
let { order } = $(userStore());
let { holdResult } = $(tradeStore());

const statusMap = [
  { text: "Waiting for publish", color: "#555555" },
  { text: "Active", color: "#555555" },
  { text: "Claiming", color: "#555555" },
  { text: "Settlement", color: "#555555" },
  { text: "Claim", color: "#555555" },
  { text: "Completed", color: "#555555" },
];

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

const dollars2cents = (value: number) => {
  return multiply(value, 100);
};

const handleTrade = async (row) => {
  await navigateTo(
    `/user?question=${formatTitle(row.question)}&id=${row.topicId}&marketId=${
      row.marketId
    }`
  );
  setModal("showTradePicker", true);
};

const handleClaim = (item: any) => {
  holdResult = {
    image: item.image,
    marketId: item.marketId,
    groupItemTitle: item.question,
    outcome: null,
    status: item.status,
    total: formatResultPrice(item.currentValue * (1 - item.settleFee)),
    outcomeName: item.typeName,
  };
  setModal("showRedeemPopup", true);
};

onMounted(() => {
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
        <template #price>
          <div>
            <!-- hold price -->
            <p class="w-[150px] text-gray-500 mt-4">
              {{ $t("Hold price") }}: {{ dollars2cents(item.holdPrice) }}€
            </p>
            <!-- the latest price -->
            <p class="w-[150px] text-gray-500">
              {{ $t("Current price") }}: {{ dollars2cents(item.lastPrice) }}€
            </p>
            <!-- shares -->
            <p class="w-32 text-gray-500">
              {{ $t("Shares") }}: {{ item.usableVolume }}
            </p>
            <!-- cost -->
            <p class="w-32 text-gray-500">
              {{ $t("Cost") }}: {{ item.typeName }} ({{
                amountMoney(item.initialValue)
              }}$)
            </p>
          </div>
          <div class="w-[150px]">
            <span
              :class="item.profitRate >= 0 ? 'text-green-500' : 'text-red-500'"
              >{{ item.currentValue }}$({{ item.profitRate }}%)</span
            >
          </div>
        </template>
        <template #tags>
          <!--
          1、wait for publish
          2、submitted, able to trade
          3、market finished, wait for result
          4、Results released internal settlement
          5、Cash withdrawal available
          6、Removed and can be archived
          -->
          <template v-for="(tag, status) in statusMap" :key="status">
            <van-tag v-if="item.status === status + 1" plain :color="tag.color">
              {{ tag.text }}
            </van-tag>
          </template>
        </template>
      </van-card>
      <template #right>
        <!--Trade button-->
        <van-button
          v-if="item.status === 2"
          square
          type="primary"
          text="Trade"
          @click="handleTrade(item)"
        />
        <van-button
          v-else-if="item.status === 5"
          square
          type="success"
          text="Claim"
          @click="handleClaim(item)"
        />
      </template>
    </van-swipe-cell>
    <OrderPositionRedeemPopup holdResult="holdResult" />
    <OrderPositionTradePopup />
  </div>
</template>
