<script lang="ts" setup>
import { _debounce } from "@/utils/debounce";
import { unitConvert } from "@/utils/processing";
import { showToast } from "vant";
import { parseUnits } from "viem";
import {
  getTopicsOrderPreview,
  getTopicsOrderCreate,
  checkTopicsOrder,
} from "@/api/markets";

const { t } = useI18n();
const props = defineProps({
  trade: {
    type: Object,
    required: true,
  },
  voData: {
    type: Object,
    required: true,
  },
});
const { trade, voData } = props;
const buySellCurrent = $(defineModel("buySellCurrent"));
const marketAvgPrice = $(defineModel("marketAvgPrice"));
const total = $(defineModel("total"));
const { tradeVolume } = $(tradeStore());
const { userBalance, signTradeData } = $(walletStore());

let priceType = 1;
let tradeSign = "";

//Click the transaction button
const transaction = _debounce(async () => {
  if (trade.details.closed) {
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
        }
      } else {
        console.log("Wallet sign failed, please check your wallet connection!");
      }
    }
  } finally {
    // switchLoading(false);
  }
}, 200);

const yesNoClick = (type) => {
  trade.yesNoCurrent = type;
};
</script>
<template>
  <div class="py-4 flex justify-around">
    <!-- YES OR NO Button-->
    <p
      @click="yesNoClick('yes')"
      class="mr-2 last-of-type:mr-0 w-[155px] h-[48px] px-4 text-sm font-bold text-center bg-[#E3F1E9] rounded-md flex flex-row justify-center items-center cursor-pointer"
      :class="{ 'bg-[#09bc8a]! text-white': trade.yesNoCurrent === 'yes' }"
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
      class="mr-2 last-of-type:mr-0 w-[155px] h-[48px] px-4 text-sm font-bold text-center bg-[#F7E8E8] rounded-md flex flex-row justify-center items-center cursor-pointer"
      :class="{ 'bg-[#fc6136]! text-white': trade.yesNoCurrent === 'no' }"
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
  <van-cell title="Shares">
    <div>{{ voData.details }}</div>
    <template #value>
      <van-stepper min="5" v-model="tradeVolume" />
    </template>
  </van-cell>
  <!--Avg price-->
  <van-cell title="Avg price">
    <template #value>
      <input
        class="text-right"
        type="text"
        :value="marketAvgPrice + '¢'"
        readonly
      />
    </template>
  </van-cell>
  <!--Price-->
  <van-cell title="Total">
    <template #value>
      <input class="text-right" type="text" :value="'$' + total" readonly />
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
      {{ buySellCurrent === "Buy" ? $t("Buy") : $t("Sell") }}
    </van-button>
  </div>
</template>
