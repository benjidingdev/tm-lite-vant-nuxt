<template>
  <div class="w-full h-full relative">
    <div v-if="cards.length">
      <div
        v-for="(card, index) in cards"
        :key="card.id"
        :class="['card', { active: currentIndex === index }]"
        :style="getCardStyle(index)"
        class="shadow-xl draggable-element"
        @touchstart.prevent="touchStart"
        @touchmove.prevent="touchMove"
        @touchend.prevent="touchEnd(card, event)"
      >
        <van-image
          width="100%"
          height="60%"
          :src="card['image']"
          class="p-2"
        >
          <div class="absolute -bottom-8 h-16 w-full">
            <div class="flex justify-between items-center h-full px-6">
              <div
                class="rounded-full bg-white w-10 h-10 flex justify-center items-center shadow-lg"
                @click="bookmark"
              >
                <van-icon name="star-o" />
              </div>
              <div
                class="rounded-full bg-white w-15 h-15 flex justify-center items-center shadow-lg"
                @click="buyYes(card)"
              >
                <van-icon name="checked" size="66" color="#97dbb4" />
              </div>
              <div
                class="rounded-full bg-white w-15 h-15 flex justify-center items-center shadow-lg"
                @click="buyNo(card)"
              >
                <van-icon name="clear" size="66" color="#fe9595" />
              </div>

              <div
                class="rounded-full bg-white w-10 h-10 flex justify-center items-center shadow-lg"
                @click="bookmark"
              >
                <van-icon name="star-o" />
              </div>
            </div>
          </div>
        </van-image>
        <div class="p-4 h-[38.2%]">
          <div class="h-[80%] overflow-auto">
            <text class="name mt-4">{{ card.title }}</text>
            <text v-if="card.markets.length" class="desc">{{
              card.markets[0].question
            }}</text>
          </div>
          <div class="h-[20%]">
            <text> ${{ convertCurrency(card.volume) }} Vol.</text>
          </div>
        </div>

        <div v-if="currentIndex === index" class="hint-box">
          <div class="hint like" :style="{ opacity: -offsetX / 150 }">YES</div>
          <div class="hint nope" :style="{ opacity: offsetX / 150 }">NO</div>
        </div>
      </div>
    </div>

    <div v-else>
      <van-empty
        description="If you are interested in Turning Market, please go to our official version"
      />
    </div>
  </div>
  <!--trade modal-->
  <TradeModal />
</template>

<script setup>
import axios from "axios";
import { showDialog } from "vant";
import { parseUnits } from "viem";
import _ from "lodash";
import {
  getTopicsRecommend,
  getTopicsOrderPreview,
  getTopicsOrderCreate,
  getOrderAmount,
} from "~/api/market";
import { convertCurrency } from "@/utils/processing";

const statusList = ["YES", "NO", "BOOKMARK", "NEXT"];

let cards = $ref([]);
let currentIndex = $ref(0); // The index of current card
let offsetX = $ref(0); // The value  of offsetX
let offsetY = $ref(0); // The value  of offsetY
let startX = $ref(0); // The value of startX
let startY = $ref(0); // The value of startY
let lastPage = $ref(false);
let refresherTriggered = $ref(false);
let animationFrame = $ref(null);

// The data from store
const { token, isToken } = $(authStore());
const { signTradeData, walletConfig, userBalance, queryAllowanceAndPermit } = $(
  useWalletStore()
);
const { volume } = $(coreStore());
const recommondQueryParams = $ref({
  pageNo: 1,
  pageSize: 12,
  title: "",
  active: null,
  closed: null,
  order: "trending",
  ascending: false,
  page: 1,
  tagId: null,
  followed: false,
});
let transaction = $ref({
  parentId: null,
  textName: "",
  textColor: "",
  textPrice: "",
  marketsId: null,
  marketsTitle: "",
  type: null,
  fee: null,
  marketsItem: {},
});

// get the list of cards
const getInfoList = async (refresh) => {
  if (refresh) {
    lastPage = false;
    refresherTriggered = true;
  }
  const res = await getTopicsRecommend(recommondQueryParams);
  if (res.code === 0) {
    cards = res.data.list;
  }
};

// Obtain the style of card
const getCardStyle = (index) => {
  if (index === currentIndex) {
    return {
      transform: `translateX(${offsetX}px) translateY(${offsetY}px)`,
      zIndex: 30 - index,
    };
  }
  return {
    transform: `translateX(${0}px) translateY(${1 * index}px)`,
    zIndex: 30 - index,
  };
};

// Touch start
const touchStart = (e) => {
  if (currentIndex >= cards.length) return;
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
  }
  animationFrame = requestAnimationFrame(() => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    offsetX = 0;
    offsetY = 0;
    console.log(startX, startY);
    animationFrame = null;
  });
};

// Touch move
const touchMove = (e) => {
  if (currentIndex >= cards.length) return;

  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
  }

  animationFrame = requestAnimationFrame(() => {
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    offsetX = currentX - startX;
    offsetY = currentY - startY;

    console.log("touchmove", offsetX, offsetY);
    const maxOffsetX = 150;
    const maxOffsetY = 150;
    if (Math.abs(offsetX) > maxOffsetX) {
      offsetX = offsetX > 0 ? maxOffsetX : -maxOffsetX;
    }
    if (Math.abs(offsetY) > maxOffsetY) {
      offsetY = offsetY > 0 ? maxOffsetY : -maxOffsetY;
    }
    animationFrame = null;
  });
};

// Touch end
const touchEnd = (card, event) => {
  if (currentIndex >= cards.length) return;

  const threshold = 100; // Threshold of swiping
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
  }
  animationFrame = requestAnimationFrame(() => {
    if (offsetX > threshold) {
      buyNo(card); // swipe to left means reject
    } else if (offsetX < -threshold) {
      buyYes(card); // swipe to right means accept
    } else if (offsetY > threshold) {
      pickNext(); // swipe down means pick next card
    } else if (offsetY < -threshold) {
      bookmark(); // swipe up means bookmark
    } else {
      resetCard(); // reset the position of card
    }
    animationFrame = null;
  });
};

// Card swipe Animation
const swipeCard = (status, callback) => {
  let direction =
    statusList.indexOf(status) === 0 || statusList.indexOf(status) === 2
      ? 1
      : -1;
  offsetX = direction * 500;
  offsetY = direction * 500;
  // Switch to next card after 0.3 second
  setTimeout(() => {
    offsetX = 0;
    offsetY = 0;
    // The result of card swiping
    if (currentIndex >= cards.length) {
      // uni.showToast({
      //   title: "no more cards",
      //   icon: "none",
      // });
    }
    cards.shift();
    if (typeof callback === "function") {
      callback();
    }
  }, 0);
};

// reset the position of cards
const resetCard = () => {
  offsetX = 0;
  offsetY = 0;
};

const buyYes = (card) => {
  console.log(card);
  const { title, type } = card;
  transaction = {
    parentId: null,
    textName: card.markets[0].yesName,
    textColor: "",
    textPrice: card.markets[0].yesPrice,
    marketsId: card.markets[0].id,
    marketsTitle: title,
    type: type,
    fee: null,
    marketsItem: {},
  };
  goDeposit();
  // sendPimlicoTranscation();
};

const buyNo = (card) => {
  const { title, type } = card;
  transaction = {
    parentId: null,
    textName: card.markets[0].noName,
    textColor: "",
    textPrice: card.markets[0].noPrice,
    marketsId: card.markets[0].id,
    marketsTitle: title,
    type: type,
    fee: null,
    marketsItem: {},
  };
  goDeposit();
};

const bookmark = () => {
  swipeCard(statusList[2], () => {});
};

const pickNext = () => {
  swipeCard(statusList[3], () => {});
};

const showMsgDialog = (title, message, confirmButtonText) => {
  showDialog({
    title,
    message,
    confirmButtonText: "OK",
  });
};

// start transcation
const goDeposit = async () => {
  console.log(volume, "volume");
  if (token.accessToken === "") {
    showMsgDialog(
      "Please Login!",
      "Please login to your account to proceed with the transaction."
    );
    resetCard();
    isToken(true);
  } else {
    // balance check
    if (userBalance < transaction.textPrice) {
      showMsgDialog(
        "Insufficient balance",
        "Insufficient balance, please recharge first!"
      );
      return false;
    }
    try {
      // switchLoading(true);
      const amountRes = await getOrderAmount();
      // if (amountRes.code === 0) {
      //   const allowanceAmount =
      //     (transaction.textPrice + transaction.fee) * volume;
      //   amountRes.data.totalAmount;
      //   let allowanceRes = await queryAllowanceAndPermit(0, allowanceAmount);
      //   if (!allowanceRes) {
      //     // return ElMessage.error("Permit authorization failed!");
      //     showMsgDialog({
      //       title: "Permit Authorization Failed",
      //       message:
      //         "Please authorize the permit to proceed with the transaction.",
      //       confirmButtonText: "OK",
      //     });
      //     return false;
      //   }
      // } else {
      //   showMsgDialog({
      //     title: "Permit Authorization Failed",
      //     message:
      //       "Please authorize the permit to proceed with the transaction.",
      //     confirmButtonText: "OK",
      //   });
      //   return false;
      // }

      const req = {
        marketId: transaction.marketsId || 1012110,
        type: transaction.type, //1-YES；2-NO,
        amount: null,
        volume: volume,
        priceType: 1, //1-market price ；2-limited price; 3-merged price; 4-split price
        orderType: 1, //1: buy, 2: sell
        price: transaction.textPrice * 100,
        isDeduction: false,
      };
      let result = await getTopicsOrderPreview(req);
      if (result.code === 0) {
        const order = { ...result.data };
        let tradeSign;
        try {
          result.data.slippageBps = parseUnits(result.data.slippageBps + "", 4);
          result.data.tokenAmount = parseUnits(result.data.tokenAmount + "", 6);
          result.data.tokenPriceInPaymentToken = parseUnits(
            result.data.tokenPriceInPaymentToken + "",
            6
          );
          tradeSign = await signTradeData({ order: result.data });
        } catch (e) {}
        if (tradeSign) {
          const params = {
            salt: order.salt,
            message: JSON.stringify(order),
            signContent: tradeSign,
          };
          let res = await getTopicsOrderCreate(params);
          if (res.code === 0) {
            if (transaction.type === 1) {
              swipeCard(statusList[0]);
            } else {
              swipeCard(statusList[1], () => {});
            }
            showMsgDialog(
              "Transaction Successful",
              "Your transaction has been successfully processed."
            );
          } else {
            showMsgDialog(
              "Transaction Failed",
              res.message || "An error occurred during the transaction."
            );
          }
        }
      }
    } finally {
      // switchLoading(false);
    }
  }
};

onMounted((e) => {
  getInfoList(false);
});
</script>

<style>
.card {
  position: absolute;
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 15px;
  transition: all 0.3s ease;
  overflow: hidden;
}

.name {
  font-size: 20px;
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
}

.hint-box {
  position: absolute;
  top: 30px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
}

.hint {
  padding: 5px 15px;
  border-radius: 5px;
  font-weight: bold;
  font-size: 20px;
  color: white;
  border: 3px solid white;
  opacity: 0;
  transition: opacity 0.3s;
}

.hint.like {
  background: rgba(82, 196, 26, 0.7);
}

.hint.nope {
  background: rgba(255, 77, 79, 0.7);
}

.btn.like {
  border: 2px solid #52c41a;
}
.van-image img{
  border-radius: 15px;
}

.draggable-element {
  will-change: transform;
  touch-action: none;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  contain: content;
}
</style>
