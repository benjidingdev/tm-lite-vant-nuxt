<script setup lang="ts">
import { ref } from "vue";
import { showToast } from "vant";
import { Decimal } from "decimal.js";
import type {
  TopicReqVO,
  SportLiveTopicsVO,
  TopicMarketsRespVO,
  TopicsDetailRespVO,
  UserHoldInfo,
  UserOrderInfo,
  SeriesTopicsRespVO,
} from "@/types/market";

import { decimal } from "@/utils/decimal";
import {
  formatResultPrice,
  unitConvert,
} from "@/utils/processing";
import {
  getTopicsDetails,
  getNewPricesMarkets,
  getUserHoldInfo,
  getUserOrderInfo,
} from "@/api/markets";
import { _debounce } from "@/utils/debounce";

const { t } = useI18n();
const { modalIsShow } = $(uiStore());
const { query } = $(useRoute());
const { token } = $(authStore());
const { tradeVolume } = $(tradeStore());

let tradeTypeActive = $ref(0);
const trade = $ref({
  yesNoCurrent: "yes",
  buySellCurrent: "Buy",
  buySellList: [
    {
      id: 1,
      label: "Buy",
      value: 0,
    },
    {
      id: 2,
      label: "Sell",
      value: 1,
    },
  ],
  details: {} as TopicsDetailRespVO,
  buttonList: [],
  shares: 0,
});

type TopicMarketsPriceVO = Omit<TopicMarketsRespVO, "lastTradePrice"> & {
  yesPrices: {
    buyOnePrice: Decimal;
    sellOnePrice: Decimal;
  };
  noPrices: {
    buyOnePrice: Decimal;
    sellOnePrice: Decimal;
  };
  lastTradePrice: Decimal;
  position: UserHoldInfo[];
};

const holdResult = $ref({
  image: "",
  marketId: null,
  groupItemTitle: "",
  outcome: null,
  status: null,
  total: 0,
  outcomeName: "",
  position: [],
});

const voData = $ref({
  id: null,
  seriesId: null,
  isTime: false,
  timeTabChangeFlag: false, //Sequence match switching
  timeOptionList: [] as SportLiveTopicsVO[],
  timeTabList: [] as SportLiveTopicsVO[],
  details: {} as TopicsDetailRespVO,
  holdList: [] as UserHoldInfo[],
  orderList: [] as UserOrderInfo[],
  activityList: [],
  total: 0,
  bookItem: {},
  subscribeId: [],
  aiText: "",
  aiImgList: [],
  selectSeriesTopics: {},
  seriesTopicsList: [],
  seriesTopicsClosedList: [],
});

const voState = $ref({
  showShare: false,
  defaultCurrent: 3, //Selected by default
  initFlag: true,
});

const exhibition = $ref({
  aiLoading: false,
  isMarket: false,
  isRules: false,
  statisticsId: null,
  statisticsDrawer: false,
  tradeDrawer: false,
  timeId: null,
  positions: true,
  books: false,
  order: true,
  isResult: false, //Topic All Market Results
  isSingle: null, //Is it a single market
  negRiskMarkets: false,
  isNegRiskExitResult: false, //There is a single result in non-correlation markets
  currentSelectMarketResult: false, //Non-relevant market single results
  moreShow: false,
  outcomePosition: false, //Position redemption display
  isResultOutComeVisible: false, //PC multi-market results are not displayed on the home page
  cashOutDrawer: false,
});

// We only support market price just now
let priceType = 1;

//Calculate the current order price
const price = $computed(() => {
  if (priceType === 2) {
    return voData.limitPrice;
  } else if (trade.buySellCurrent === "Buy") {
    return unitConvert(
      trade.yesNoCurrent === "yes"
        ? trade?.details?.yesPrices?.sellOnePrice
        : trade?.details?.noPrices?.sellOnePrice
    );
  } else {
    return unitConvert(
      trade.yesNoCurrent === "yes"
        ? trade?.details?.yesPrices?.buyOnePrice
        : trade?.details?.noPrices?.buyOnePrice
    );
  }
});

const fee = $computed(() => {
  return trade.buySellCurrent === "Buy"
    ? voData?.details?.buyFee
    : voData?.details?.sellFee;
});

const total = $computed(() => {
  if (tradeVolume) {
    let total = Number(((price / 100) * (1 + fee) * tradeVolume).toFixed(4));
    return total;
  } else {
    return 0;
  }
});

//orderType: 1(buy), priceType: 1(market price：Market) Value of AvgPrice
const marketAvgPrice = $computed(() => {
  const { details, yesNoCurrent, buySellCurrent } = trade;
  if (tradeVolume && details && details.yesPrices && details.noPrices) {
    if (yesNoCurrent === "yes") {
      return (
        unitConvert(
          buySellCurrent === "Buy"
            ? details.yesPrices.sellOnePrice
            : details.yesPrices.buyOnePrice
        ) * 1
      );
    } else {
      return (
        unitConvert(
          buySellCurrent === "Buy"
            ? details.noPrices.sellOnePrice
            : details.noPrices.buyOnePrice
        ) * 1
      );
    }
  } else {
    return 0;
  }
});

// Get the latest market price
const newPriceMarkets = async (markets) => {
  const reqVO = {
    topicId: voData.details.id,
  } as TopicReqVO;
  const res = await getNewPricesMarkets(reqVO);
  if (res) {
    markets.forEach((market) => {
      const matchingItem = res.data.prices.find(
        (price) => price.mid === market.id
      );
      if (matchingItem) {
        market.yesPrices = {
          buyOnePrice: decimal(matchingItem.yes.b),
          sellOnePrice: decimal(matchingItem.yes.s),
        };
        market.noPrices = {
          buyOnePrice: decimal(1).sub(decimal(matchingItem.yes.s)),
          sellOnePrice: decimal(1).sub(decimal(matchingItem.yes.b)),
        };
        market.lastTradePrice = decimal(matchingItem.yes.l);
      }
    });
  }
  if (!trade.details.id) {
    if (query.marketId) {
      const market = markets.find(
        (market) => market.id === Number(query.marketId)
      );
      if (market) {
        trade.details = market;
      } else {
        trade.details = markets[0];
      }
    } else {
      trade.details = markets[0];
    }
    trade.buttonList = [
      {
        id: 1,
        name: trade.details.yesName,
        buyOnePrice: trade.details.yesPrices?.buyOnePrice,
        sellOnePrice: trade.details.yesPrices?.sellOnePrice,
        type: "yes",
      },
      {
        id: 2,
        name: trade.details.noName,
        buyOnePrice: trade.details.noPrices?.buyOnePrice,
        sellOnePrice: trade.details.noPrices?.sellOnePrice,
        type: "no",
      },
    ];
  }
};

//Get the current user entrustment information
const getOrderInfo = _debounce(async () => {
  try {
    if (!token?.accessToken) return;

    if (voData.orderList.length === 0) {
      // loading.order = true
    }
    const res = await getUserOrderInfo({
      topicId: undefined,
      marketId: trade.details.id,
    });
    if (res) {
      voData.orderList = res.data;
      if (voData.orderList.length > 0) {
        exhibition.order = true;
      }
    }
  } finally {
  }
}, 200);

//Get all positions under the topic
const getTopicPosition = _debounce(async () => {
  try {
    if (!token?.accessToken) return;

    if (voData.holdList.length === 0) {
      // loading.hold = true
    }
    const res = await getUserHoldInfo({
      topicId: voData.details.id,
      marketId: undefined,
    });
    if (res) {
      //Update the position list
      voData.holdList = res.data ?? [];
      //Setting the position tag
      voData.holdList &&
        voData.holdList.forEach((item: UserHoldInfo) => {
          let index = voData.details.markets.findIndex(
            (market: TopicMarketsPriceVO) => market.id === item.marketId
          );
          if (index >= 0 && voData.details.markets[index].position == null)
            voData.details.markets[index].position = [];
          if (index >= 0) voData.details.markets[index].position.push(item);
        });
      //Determine whether there is a position
      exhibition.positions = voData.holdList.length > 0;
      //Show results
      if (exhibition.isResult && exhibition.isSingle) {
        exhibition.isResultOutComeVisible = true;
        getMarketResult(res.data ?? [], trade.details);
      } else {
        exhibition.isResultOutComeVisible = false;
      }
    }
  } finally {
  }
}, 200);

const tradeTypeClick = (data: { title: string }) => {
  const { title } = data;
  trade.buySellCurrent = title;
  tradeTypeActive = title === "Buy" ? 0 : 1;
};

//Get results
const getMarketResult = (
  position: UserHoldInfo[],
  tradeItem: TopicMarketsPriceVO
) => {
  exhibition.isResultOutComeVisible = true;
  let tmpPosition;
  if (position && position.length > 0) {
    tmpPosition = position.filter((row) => row.type === tradeItem.outcome);
  }
  exhibition.outcomePosition = position && position.length > 0;
  holdResult.settleFee = voData.details.settleFee || 0;
  holdResult.position = position;
  holdResult.marketId = tradeItem.id;
  holdResult.redeemTime = tradeItem.redeemTime;
  holdResult.image = tradeItem.image;
  holdResult.outcome = tradeItem.outcome;
  holdResult.status = tradeItem.status;
  holdResult.groupItemTitle =
    voData.details.markets.length === 1
      ? tradeItem.question
      : tradeItem.groupItemTitle;
  holdResult.question = tradeItem.question;
  holdResult.outcomeName =
    tradeItem.outcome === 1 ? tradeItem.yesName : tradeItem.noName;
  if (tmpPosition && tmpPosition.length) {
    holdResult.total = tmpPosition[0].usableVolume
      ? formatResultPrice(
        tmpPosition[0].currentValue * (1 - holdResult.settleFee)
      )
      : 0;
  } else {
    holdResult.total = 0;
  }
};

// Get topic details
const getDetails = async () => {
  try {
    const res = await getTopicsDetails(voData.id);
    if (res) {
      voData.details = res.data;
      if (res.data && res.data?.seriesTopics?.length > 0) {
        voData.seriesTopicsList = res.data?.seriesTopics.filter(
          (item) => !item.closed
        );
        voData.seriesTopicsClosedList = res.data?.seriesTopics.filter(
          (item) => item.closed
        );
        const tempTopics = voData.seriesTopicsClosedList.find(
          (item: SeriesTopicsRespVO) => item.id == voData.id
        );
        voData.selectSeriesTopics = tempTopics || {};
      }

      if (res.data && res.data.markets.length > 0) {
        // Get the latest price
        await newPriceMarkets(voData.details.markets);
        // Get the user position
        if (token?.accessToken) {
          getTopicPosition();
          getOrderInfo();
        }
        trade.details = voData.details.markets[0];

        // Subscribe to order book
        if (
          voState.initFlag &&
          res.data.markets &&
          res.data.markets.length > 0
        ) {
          voState.initFlag = !voState.initFlag;
          res.data.markets.forEach((item) => {
            voData.subscribeId.push(item.id);
          });
        }
      }
    } else {
      navigateTo("/");
    }
  } finally {
  }
};

const onCancel = () => {
  showToast(t("cancel"));
};

//Clicked sharesMax
const sharesMaxHandle = () => {
  // tradeVolume = sharesMax.value
};

watch(
  () => query.id,
  async (newValue: boolean) => {
    if (newValue) {
      voData.id = query.id;
      await getDetails();
    }
  },
  { immediate: true }
);
</script>

<template>
  <van-popup v-model:show="modalIsShow.showTradePicker" destroy-on-close round position="bottom">
    <van-tabs v-model:active="tradeTypeActive" @click-tab="tradeTypeClick">
      <van-tab title="Buy">
        <OrderPositionTradeComponent v-model:buySellCurrent="trade.buySellCurrent"
          v-model:marketAvgPrice="marketAvgPrice" v-model:total="total" :trade="trade" :voData="voData" />
      </van-tab>
      <van-tab title="Sell">
        <OrderPositionTradeComponent v-model:buySellCurrent="trade.buySellCurrent"
          v-model:marketAvgPrice="marketAvgPrice" v-model:total="total" :trade="trade" :voData="voData" />
      </van-tab>
    </van-tabs>
  </van-popup>
</template>
