<script setup lang="ts">
import { ref } from "vue";
import { showToast } from "vant";
import { parseUnits } from "viem";
import { Decimal } from "decimal.js";
import type {
  TopicReqVO,
  SeriesReqVO,
  SportLiveTopicsVO,
  TopicMarketsRespVO,
  TopicsDetailRespVO,
  UserHoldInfo,
  UserOrderInfo,
  TopicSummaryRespVO,
  SeriesTopicsRespVO,
} from "@/types/market";

import { add, subtract, decimal } from "@/utils/decimal";
import {
  convertCurrency,
  formatResultPrice,
  formatTitle,
  percentage,
  unitConvert,
} from "@/utils/processing";
import {
  getSeriesList,
  getTopicsDetails,
  getTopicsWatchlist,
  getNewPricesMarkets,
  getSummary,
  getUserHoldInfo,
  getUserOrderInfo,
  cancelUserOrder,
  getTopicsOrderPreview,
  getTopicsOrderCreate,
  checkTopicsOrder,
} from "@/api/markets";
import { _debounce } from "@/utils/debounce";

const { t } = useI18n();
const { modalIsShow } = $(uiStore());
const { query } = $(useRoute());
const { token } = $(authStore());
const { userBalance, signTradeData } = $(walletStore());
const { tradeVolume } = $(tradeStore());

const buyTab = ref("");
const sellTab = ref("");

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
let tradeSign = "";

//Click the transaction button
const transaction = _debounce(async () => {
  if (trade.details.closed) {
    // ElMessage.warning('The market is closed.')
    return false;
  }

  if (
    (priceType === 1 && trade.buySellCurrent === "Sell" && !tradeVolume) ||
    (priceType === 2 && !tradeVolume) ||
    tradeVolume < 1
  ) {
    voData.promptShares = true;
    voData.promptSharesText = "Invalid share quantity";
    return false;
  } else if (trade.buySellCurrent === "Buy" && tradeVolume < 5) {
    // limit buy volume must be at least 5 shares
    voData.promptShares = true;
    voData.promptSharesText = "Minimum 5 shares for orders";
    return false;
  }
  voData.promptShares = false;

  if (priceType === 2 && !voData.limitPrice) {
    voData.promptLimitPrice = true;
    voData.promptLimitPriceText = "Limit Price too low";
    return false;
  }
  if (priceType === 2 && voData.isExceedLimitRatio) {
    return false;
  }

  //Since the balance is US dollars, it needs to be converted into cents to calculate
  if (
    voData.limitPrice &&
    trade.buySellCurrent === "Buy" &&
    voData.limitPrice > unitConvert(userBalance)
  ) {
    voData.promptLimitPrice = true;
    voData.promptLimitPriceText = "Insufficient Balance";
    return false;
  }
  voData.promptLimitPrice = false;

  if (voData.setDateFlag && voData.expireType === 3) {
    if (voData.expireTime === "") return (voData.promptDate = true);
    else if (
      voData.expireTime < Date.now() ||
      voData.expireTime > trade.details.endDate
    )
      return (voData.errorDate = true);
  }
  voData.promptDate = false;
  voData.errorDate = false;

  try {
    //If it is a sale, check the position information
    if (trade.buySellCurrent === "Sell") {
      const res = await checkTopicsOrder({
        marketId: trade.details.id,
        type: trade.yesNoCurrent === "yes" ? 1 : 2, //1-YES；2-NO,
        volume: tradeVolume,
      });
      if (res.code !== 0) {
        // return ElMessage.error("You currently have no open positions");
      }
    }

    //Get the timestamp for the evening of the day
    const now = new Date(); // Get the current date and time
    now.setHours(23, 59, 59, 999); // Set the time to 23:59:59.999 on the same day
    const initDay = now.getTime(); // Get the timestamp (in milliseconds)

    const req = {
      marketId: trade.details.id,
      type: trade.yesNoCurrent === "yes" ? 1 : 2, //1-YES；2-NO,
      price:
        priceType === 2
          ? voData.limitPrice
          : trade.buySellCurrent === "Buy"
          ? unitConvert(
              trade.yesNoCurrent === "yes"
                ? trade.details.yesPrices.sellOnePrice
                : trade.details.noPrices.sellOnePrice
            )
          : unitConvert(
              trade.yesNoCurrent === "yes"
                ? trade.details.yesPrices.buyOnePrice
                : trade.details.noPrices.buyOnePrice
            ),
      volume: tradeVolume,
      priceType:
        trade.buySellCurrent === "Buy" && priceType === 3 ? 4 : priceType, //1-Market；2-Limit；3-Merge；4-Split buy-amm-4 sell-amm-3
      orderType: trade.buySellCurrent === "Buy" ? 1 : 2, //1: buy, 2: sell
      expireType:
        priceType === 2 ? (voData.setDateFlag ? voData.expireType : 0) : "",
      expireTime: voData.setDateFlag
        ? voData.expireType === 2
          ? initDay
          : voData.expireType === 3
          ? voData.expireTime
          : ""
        : "",
      limitRate: priceType === 2 ? "" : voData.limitRate,
      isDeduction: voData.useTokens,
    };
    const result = await getTopicsOrderPreview(req);
    if (result.code === 0) {
      const order = { ...result.data };
      result.data.slippageBps = parseUnits(result.data.slippageBps + "", 4);
      result.data.tokenAmount = parseUnits(result.data.tokenAmount + "", 6);
      result.data.tokenPriceInPaymentToken = parseUnits(
        result.data.tokenPriceInPaymentToken + "",
        6
      );
      tradeSign = await signTradeData({ order: result.data });
      if (tradeSign) {
        const params = {
          salt: order.salt,
          message: JSON.stringify(order),
          signContent: tradeSign,
        };
        const res = await getTopicsOrderCreate(params);

        if (res.code === 0) {
          showToast(t("successTrade"));
          // if (priceType === 2 && trade.buySellCurrent === "Sell")
          // emit("successTrade");
        }
      } else {
        console.log("Wallet sign failed, please check your wallet connection!");
      }
    }
  } finally {
    // switchLoading(false);
  }
}, 200);

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
    console.log(
      "total",
      total,
      "price",
      price,
      "fee",
      fee,
      "tradeVolume",
      tradeVolume
    );
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

const tradeTypeClick = (label: string) => {
  // emit('update:buySellCurrent', label)
  // updateLimitPrice(priceType, props.yesNoCurrent)
  // if ('Buy' == label)
  //   voData.volumeShares = 0
  // else
  //   sharesMaxHandle()
  // voData.promptShares = false
  trade.buySellCurrent = label;
}

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
        //Update price limits
        // updateLimitRate(trade.details.marketPriceLimit * 100);

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

const yesNoClick = (type) => {
  if ("Sell" == trade.buySellCurrent) {
    const timer = setTimeout(() => {
      sharesMaxHandle();
      clearTimeout(timer);
    }, 100);
  }
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
  <van-popup
    v-model:show="modalIsShow.showTradePicker"
    destroy-on-close
    round
    position="bottom"
  >
    <van-picker-group
      title="Position Trade"
      :tabs="['Buy', 'Sell']"
      @confirm="onConfirm"
      @cancel="onCancel"
    >
      <van-cell-group v-model="buyTab">
        <van-cell-group>
          <div class="py-4 flex justify-around">
            <p
              @click="yesNoClick('yes')"
              class="mr-2 last-of-type:mr-0 w-[155px] h-[48px] px-4 text-sm dark:text-[#7a8289] font-bold text-center bg-[#E3F1E9] dark:bg-[#2b3d4d] rounded-md flex flex-row justify-center items-center cursor-pointer"
              :class="{ 'active-button-yes': trade.yesNoCurrent === 'yes' }"
            >
              {{ trade.details.yesName }}
              {{
                unitConvert(
                  trade.buySellCurrent === "Buy"
                    ? trade.details.yesPrices?.sellOnePrice
                    : trade.details.yesPrices?.buyOnePrice
                )
              }}¢
            </p>
            <p
              @click="yesNoClick('no')"
              class="mr-2 last-of-type:mr-0 w-[155px] h-[48px] px-4 text-sm font-bold text-center bg-[#F7E8E8] dark:bg-[#2b3d4d] rounded-md flex flex-row justify-center items-center cursor-pointer"
              :class="{ 'active-button-No': trade.yesNoCurrent === 'no' }"
            >
              {{ trade.details.noName }}
              {{
                unitConvert(
                  trade.buySellCurrent === "Buy"
                    ? trade.details.noPrices?.sellOnePrice
                    : trade.details.noPrices?.buyOnePrice
                )
              }}¢
            </p>
          </div>
          <!--Shares-->
          <van-cell title="shares">
            <template #value>
              <input type="text" v-model="tradeVolume" />
            </template>
          </van-cell>
          <!--Avg price-->
          <van-cell title="Avg price">
            <template #value>
              <input type="text" :value="marketAvgPrice" />
            </template>
          </van-cell>
          <!--Price-->
          <van-cell title="Total">
            <template #value>
              <input type="text" :value="total" />
            </template>
          </van-cell>
          <div style="margin: 16px">
            <van-button
              round
              block
              type="primary"
              native-type="submit"
              @click="transaction"
            >
              {{ $t("Buy") }}
            </van-button>
          </div>
        </van-cell-group>
      </van-cell-group>

      <van-cell-group v-model="sellTab">
        <div style="margin: 16px">
          <van-button
            round
            block
            type="primary"
            native-type="submit"
            @click="transaction"
          >
            {{ $t("Sell") }}
          </van-button>
        </div>
      </van-cell-group>
    </van-picker-group>
  </van-popup>
</template>


