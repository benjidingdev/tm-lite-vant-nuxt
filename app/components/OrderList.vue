<template>
  <van-tabs :active="active" :before-change="beforeChange">
    <van-tab title="Positions">
      <div
        class="w-full bg-color-white p-4 h-[calc(100vh-80px-248px-50px)] overflow-auto"
        v-if="positionList.length !== 0"
      >
        <van-card
          v-for="item in positionList"
          currency="$"
          :key="item.marketId"
          :price="item.profit + '(' + item.profitRate + '%)'"
          :desc="item.description"
          :title="item.question"
          :thumb="item.image"
          @click="goToDetails(item)"
        >
          <template #footer>
            <van-button
              plain
              size="mini"
              type="primary"
              @click="showShares(item)"
              >Shares
            </van-button>
          </template>
        </van-card>
      </div>
    </van-tab>
    <van-tab title="Open orders">
      <div
        class="w-full bg-color-white p-4 h-[calc(100vh-80px-248px-50px)] overflow-auto"
        v-if="openOrderList.length !== 0"
      >
        <van-card
          v-for="item in openOrderList"
          currency="$"
          :key="item.marketId"
          :price="item.profit + '(' + item.profitRate + '%)'"
          :desc="item.description"
          :title="item.question"
          :thumb="item.image"
          @click="goToDetails(item)"
        >
          <template #footer>
            <van-button
              plain
              size="mini"
              type="primary"
              @click="showShares(item)"
              >Shares
            </van-button>
          </template>
        </van-card>
      </div></van-tab
    >
    <van-tab title="History">
      <div
        class="w-full bg-color-white p-4 h-[calc(100vh-80px-248px-50px)] overflow-auto"
        v-if="historyList.length !== 0"
      >
        <van-card
          v-for="item in historyList"
          currency="$"
          :key="item.marketId"
          :price="item.profit + '(' + item.profitRate + '%)'"
          :desc="item.description"
          :title="item.question"
          :thumb="item.image"
          @click="goToDetails(item)"
        >
          <template #footer>
            <van-button
              plain
              size="mini"
              type="primary"
              @click="showShares(item)"
              >Shares
            </van-button>
          </template>
        </van-card>
      </div></van-tab
    >
  </van-tabs>

  <van-dialog v-model:show="show" title="SHARE TO" confirmButtonText="Confirm">
    <div class="w-full pb-2 px-10">
      <div class="font-sans text-center text-white text-lg font-bold">
        SHARE TO
      </div>
      <div class="flex justify-between w-full py-4">
        <!-- <div :class="`bg-[url('${item.icon}')]`" class="w-12 h-12 bg-cover cursor-pointer" 
                    v-for="item in props.images" @click="goUrl(item.url)"/> -->
        <img
          class="w-12 h-12 bg-cover"
          src="@/assets/img/telegran.png"
          @click="goUrl('https://t.me/share/url')"
        />
        <img
          class="w-12 h-12 bg-cover"
          src="@/assets/img/twitter.png"
          @click="goUrl('https://twitter.com/intent/tweet')"
        />
        <img
          class="w-12 h-12 bg-cover"
          src="@/assets/img/whatsapp.png"
          @click="goUrl('https://api.whatsapp.com/send')"
        />
      </div>
    </div>
  </van-dialog>
</template>

<script setup lang="ts">
import {
  userHoldInfoList,
  userOrderList,
  userTradeInfo,
} from "@/api/positions";
import { formatTitle } from "@/utils/processing";
import { onMounted } from "vue";

let positionList = $ref([]);
let openOrderList = $ref([]);
let historyList = $ref([]);
let show = $ref(false);
let active = $ref(0);
const { userInfo } = $(coreStore());

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
  show = true;
  // You can handle the item data here if needed
  marketId = item.marketId;
};

const fetchUserHoldInfoList = async () => {
  const res = await userHoldInfoList(voState.queryParams);
  if (voState.queryParams.pageNo === 1 && res?.data) {
    positionList = res?.data?.list;
  } else {
    positionList = positionList.concat(res?.data?.list);
  }
  voState.total = res?.data?.total;
  voState.isLoading = false;
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
    //console.log(error)
    voState.isLoading = false;
  }
};

/**
 * load user history orders
 */
const fetchHistoryList = async () => {
  try {
    const res = await userTradeInfo(voState.queryParams);
    // .then(res => {
    if (voState.queryParams.pageNo === 1) {
      historyList = res.data.list;
    } else {
      historyList = historyList.concat(res.data.list);
    }
    voState.total = res.data.total;
    voState.isLoading = false;
    // })
  } catch (error) {
    //console.log(error)
    voState.isLoading = false;
  }
};

const goUrl = (url) => {
  let path = `${url}?url=${origin}?inviteCode=${userInfo.inviteCode}&text=Get Start With Turing Market`;
  origin = `${origin}/marketsDetails`;
  path = `${url}?url=${origin}?id=${marketId}`;
  window.open(path);
  // handleClose();
};

const goToDetails = (item) => {
  const title = formatTitle(item.question);
  window.open(
    `https://avax-test.turingmarket.cc/details/${title}?id=${item.marketId}`
  );
};

const beforeChange = (index) => {
  active = index;
  switch (index) {
    case 0:
      fetchUserHoldInfoList();
      break;
    case 1:
      fetchOpenOrderList();
      break;
    case 2:
      fetchHistoryList();
      break;
  }
};

onMounted(() => {
  fetchUserHoldInfoList();
});
</script>
