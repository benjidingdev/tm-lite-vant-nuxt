<script setup lang="ts">
import { getTopicsRecommend, addTopicsWatchlist } from "~/api/markets";
import { convertCurrency, percentage } from "@/utils/processing";
import { _debounce } from "@/utils/debounce";

type Card = {
  id: number;
  title: string;
  description: string;
  image: string;
  volume: number;
  markets: Array<any>;
  followed: boolean;
};
type cardsType = Array<Card>;
type QueryParams = {
  cardID: string;
  inviteCode?: string;
};

const { t } = useI18n();
const statusList = ["YES", "NO", "BOOKMARK", "NEXT"];
let currentIndex = $ref(0); // The index of current card
let offsetX = $ref(0); // The value  of offsetX
let offsetY = $ref(0); // The value  of offsetY
let startX = $ref(0); // The value of startX
let startY = $ref(0); // The value of startY
const threshold = 100; // Threshold of swiping
// The data from store
const { userBalance } = $(walletStore());
let { addRequest, cards, isLoading } = $(requestQueueStore());
const { token } = $(authStore());
const { setModal } = $(uiStore());
const { userOrderAmount } = $(userStore());

let currentX = 0;
let currentY = 0;
const pageSize = 12;
let total = 0;
let isSettlement = $ref(false);
let queryParams: QueryParams = {
  cardID: "",
  inviteCode: "",
};
const recommondQueryParams = $ref({
  pageNo: 1,
  pageSize,
  title: null,
  active: null,
  closed: null,
  order: "trending",
  ascending: false,
  page: 1,
  tagId: null,
  followed: false,
});

let movingYes = $computed(() => offsetX < 0);
let movingNo = $computed(() => offsetX > 0);
let movingNext = $computed(() => offsetY > 50 || offsetY < -50);

// get the list of cards
const getInfoList = async (refresh: boolean) => {
  if (refresh) {
    isLoading = false;
    if (recommondQueryParams.pageNo * pageSize >= total) {
      recommondQueryParams.pageNo = 1;
      getInfoList(false);
      return;
    }
    recommondQueryParams.pageNo++;
  } else {
    isLoading = true;
    cards = [];
  }

  const res = await getTopicsRecommend(recommondQueryParams);
  total = res.data.total;

  if (res.code === 0) {
    cards.push(...res.data.list);
    cards = cards.filter((item: any) => item.markets && item.markets.length);
    // If there is cardID in the url, put this card to the first
    if (queryParams.cardID) {
      const index = cards.findIndex((item: any) => item.id === Number(queryParams.cardID));
      if (index > -1) {
        const card = cards.splice(index, 1)[0];
        cards.unshift(card);
      }
    }
  }
  isLoading = false;
};


// Obtain the style of card
const getCardStyle = (index: number) => {
  if (index === currentIndex) {
    return {
      transform: `translateX(${offsetX}px) translateY(${offsetY}px) rotate(${offsetX / 20
        }deg)`,
      zIndex: 30 - index,
    };
  }
  return {
    transform: `translateX(${0}px) translateY(${1 * index}px)`,
    zIndex: 30 - index,
  };
};

// Touch start
const touchStart = (e: TouchEvent | any) => {
  if (currentIndex >= cards.length) return;
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
  offsetX = 0;
  offsetY = 0;
};

// Touch move
const touchMove = (e: TouchEvent | any) => {
  if (currentIndex >= cards.length) return;

  currentX = e.touches[0].clientX;
  currentY = e.touches[0].clientY;

  offsetX = currentX - startX;
  offsetY = currentY - startY;

  const maxOffsetX = threshold;
  const maxOffsetY = threshold;
  if (Math.abs(offsetX) > maxOffsetX) {
    offsetX = offsetX > 0 ? maxOffsetX : -maxOffsetX;
    isSettlement = true;
  } else {
    isSettlement = false;
  }
  if (Math.abs(offsetY) > maxOffsetY) {
    offsetY = offsetY > 0 ? maxOffsetY : -maxOffsetY;
  }
};

// Touch end
const touchEnd = (card: Card) => {
  if (currentIndex >= cards.length) return;

  if (cards.length <= pageSize / 2) {
    getInfoList(true);
  }
  if (offsetX >= threshold) {
    buyNo(card); // swipe to left means reject
  } else if (offsetX <= -threshold) {
    buyYes(card); // swipe to right means accept
  } else if (offsetY >= threshold - 50) {
    pickNext(); // swipe down means pick next card
  } else if (offsetY <= -threshold + 50) {
    pickNext(); // swipe up means bookmark
  } else {
    resetCard(); // reset the position of card
  }
};

// Card swipe Animation
const swipeCard = (status: any) => {
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
    cards.shift();
  }, 0);
};

// reset the position of cards
const resetCard = () => {
  offsetX = 0;
  offsetY = 0;
};

const buyYes = (card: Card) => {
  goDeposit(card, true);
};

const buyNo = (card: Card) => {
  goDeposit(card, false);
};

const pickNext = () => {
  swipeCard(statusList[3]);
};

// start transaction
const goDeposit = async (card: Card, isYes: boolean) => {
  const transaction = {
    parentId: null,
    textColor: "",
    marketsId: card.markets[0].id,
    marketsTitle: card.title,
    fee: null,
    marketsItem: {},
    textName: "",
    textPrice: 0,
    type: 0, // 1: yes, 2: no
  };

  if (isYes) {
    transaction.textName = card.markets[0].yesName;
    transaction.textPrice = card.markets[0].yesPrice;
    transaction.type = 1;
  } else {
    transaction.textName = card.markets[0].noName;
    transaction.textPrice = card.markets[0].noPrice;
    transaction.type = 2;
  }

  if (token.accessToken === "") {
    setModal("loginModal", true);
    closeToast();
    resetCard();
  } else {
    // balance check
    const userCanUseBalance = userBalance - userOrderAmount;
    console.log({
      userBalance,
      textPrice: transaction.textPrice,
      userOrderAmount,
      userCanUseBalance,
    });
    if (userCanUseBalance < transaction.textPrice) {
      showFailToast(t("Insufficient balance"));
      resetCard();
      return false;
    }

    // add request to queue
    addRequest(transaction, card);

    if (transaction.type === 1) {
      swipeCard(statusList[0]);
    } else {
      swipeCard(statusList[1]);
    }
  }
  resetCard();
};



onMounted(() => {
  getInfoList(false);
  queryParams = getFatherInviteCode();
});
</script>

<template>
  <OnboardingGuide />
  <div class="w-full h-[90%] relative z-10!">
    <van-skeleton :loading="isLoading">
      <template #template>
        <div class="w-full h-[80vh] flex flex-col justify-center items-center ">
          <div class="w-full h-[70vw] flex justify-center items-center bg-[var(--van-active-color)] rounded-[24px]">
            <van-loading size="48" />
          </div>

          <!-- <van-skeleton-image /> -->
          <div :style="{ marginTop: '42px', width: '100%' }">
            <van-skeleton-paragraph row-width="60%" />
            <van-skeleton-paragraph />
            <van-skeleton-paragraph />
            <van-skeleton-paragraph />
          </div>
        </div>
      </template>

      <div v-if="cards.length">
        <div v-for="(card, index) in cards as cardsType" :key="card.id"
          :class="['card', 'draggable-element', 'shadow-md', { active: currentIndex === index }]"
          :style="getCardStyle(index)" @touchstart="(e) => _debounce(touchStart(e))"
          @touchmove="(e) => _debounce(touchMove(e))" @touchend="(e) => _debounce(touchEnd(card))">
          <van-image width="100%" height="50%" :src="card['image']" class="p-2" fit="contain">
            <div class="absolute -bottom-8 h-16 w-full z-50">
              <div class="flex justify-between items-center h-full px-6">
                <div class="flex flex-col items-center text-">
                  <div id="step4"
                    :class="`rounded-full w-15 h-15 flex justify-center items-center shadow-lg bg-white ml-6`"
                    @click="buyYes(card)">
                    <van-icon name="checked" size="66" color="#97dbb4" />
                  </div>
                  <text class="text-[#97dbb4]">{{ unitConvert(card.markets[0].yesPrice * 100 || 0) }}¢</text>
                </div>
                <div class="flex flex-col items-center">
                  <div id="step5"
                    class="rounded-full bg-white w-15 h-15 flex justify-center items-center shadow-lg mr-6"
                    @click="buyNo(card)">
                    <van-icon name="clear" size="66" color="#fe9595" />
                  </div>
                  <text class="text-[#fe9595]">{{ unitConvert(card.markets[0].noPrice * 100 || 0) }}¢</text>
                </div>
              </div>
            </div>
            <div v-if="index === 0" class="hint-box" id="step6">
              <div v-if="isSettlement && movingYes" class="hint-box hint like">
                YES
              </div>
              <div v-else-if="isSettlement && movingNo" class="hint-box hint nope">
                NO
              </div>
              <div v-else-if="movingNext" class="hint-box hint next">NEXT</div>
            </div>
          </van-image>

          <div v-if="card.markets" class="px-4 pt-4 h-[50%]">
            <div class="h-[85%] overflow-auto">
              <SwipeCardProgressBar class="mt-10" :lastTradePrice="percentage(card?.markets[0].lastTradePrice, 'num')
                " />
              <text class="name mt-4">{{ card.title }}</text>
              <text v-if="card?.markets.length" class="desc">{{
                card?.markets[0].question
              }}</text>
            </div>

            <div class="h-[15%] flex justify-between">
              <text> ${{ convertCurrency(card.volume) }} Vol.</text>
              <SwipeCardShareCard :cardID="card.id" />
            </div>
          </div>
        </div>
      </div>

      <div v-else>
        <van-empty description="If you are interested in Turing Market, please go to our official version"
          style="--van-empty-description-color: #323232">
          <template #image>
            <img src="/assets/icon/logo.svg" />
          </template>

          <van-button round type="primary" class="bottom-button">Launch App</van-button>
        </van-empty>
      </div>
    </van-skeleton>
  </div>
</template>

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
  top: 2px;
  bottom: 2px;
  left: 2px;
  right: 2px;
  z-index: 0;
  border-radius: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hint {
  font-weight: bold;
  font-size: 36px;
  color: white;
  border: 3px solid white;
  opacity: 1;
  transition: opacity 0.3s;
}

.hint.like {
  background: rgba(82, 196, 26, 0.7);
}

.hint.nope {
  background: rgba(255, 77, 79, 0.7);
}

.hint.next {
  background: rgba(173, 173, 173, 0.7);
}

.van-image img {
  border-radius: 15px;
}

.draggable-element {
  will-change: transform;
  touch-action: none;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  contain: content;
}

.gradient-left {
  background-image: linear-gradient(to right, #4fd1c5, #a4e4d5);
}

.gradient-right {
  background-image: linear-gradient(to right, #f2a4b7, #f472b6);
}
</style>
