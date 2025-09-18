<script setup lang="ts">
import { getTopicsRecommend, addTopicsWatchlist } from "~/api/markets";
import { convertCurrency, percentage } from "@/utils/processing";
import { _debounce } from "@/utils/debounce";
const debug = useDebug('SwipeCard')

type Card = {
  id: number;
  title: string;
  description: string;
  image: string;
  volume: number;
  markets: Array<any>;
  followed: boolean;
  yesNum: number;
  noNum: number;
};
type cardsType = Array<Card>;
type QueryParams = {
  cardID: string;
  inviteCode?: string;
};

const statusList = ["YES", "NO", "BOOKMARK", "NEXT"];
let currentIndex = $ref(0); // The index of current card
let offsetX = $ref(0); // The value  of offsetX
let offsetY = $ref(0); // The value  of offsetY
let startX = $ref(0); // The value of startX
let startY = $ref(0); // The value of startY
const threshold = 100; // Threshold of swiping
// The data from store
const { setModal } = $(uiStore());
let { isLoading } = $(requestQueueStore());
let { pdcCards }: any = $(pdcSwipeCardStore());

const topicsId = 2; // default topic id
let currentX = 0;
let currentY = 0;
const pageSize = 12;
let total = 0;
let isSettlement = $ref(false);
const customMarkets: any = $ref(markets());

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

const { query, path } = $(useRoute());

let movingYes = $computed(() => offsetX < 0);
let movingNo = $computed(() => offsetX > 0);
let movingNext = $computed(() => offsetY > 50 || offsetY < -50);

const initMarket = async (topicId: number, markets: any) => {
  let res = await doFetch('/api/topics/updateTopic', {
    method: 'POST',
    body: {
      topicId,
      markets,
    }
  })
}

const updateMarket = async (topicId: number, markets: any) => {
  let res = await doFetch('/api/topics/updateTopic', {
    method: 'POST',
    body: {
      topicId,
      markets,
    }
  })
  console.log('createMarket res', res)
}

const getMarket = async (topicId: any) => {
  let res: any = await doFetch(`/api/topics/${topicId}`, {
    method: 'GET',
  })
  const markets = res?.data?.markets || [];
  console.log('getMarket res', markets)
  return markets;
}

let { userAsset } = $(pdcSwipeCardStore())

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
  }

  pdcCards = await getMarket(topicsId);
  console.log('customMarkets', customMarkets.length, 'pdcCards', pdcCards.length, customMarkets?.length !== pdcCards.length);
  if (customMarkets?.length !== pdcCards.length) {
    await initMarket(topicsId, customMarkets);
    pdcCards = await getMarket(topicsId);
  }
  console.log('pdcCards', pdcCards);
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
  if (currentIndex >= pdcCards.length) return;
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
  offsetX = 0;
  offsetY = 0;
};

// Touch move
const touchMove = (e: TouchEvent | any) => {
  if (currentIndex >= pdcCards.length) return;

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
  if (currentIndex >= pdcCards.length) return;

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
    pdcCards.shift();
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

const updateAsset = async (userAsset: any) => {
  let res = await doFetch('/api/assets/updateAsset', {
    method: 'POST',
    body: {
      pAmount: userAsset,
    }
  })
  console.log('updateAsset res', res)
}

const updateUserMarkets = async (market: any) => {
  let res = await doFetch('/api/usermarkets/updateUserMarket', {
    method: 'POST',
    body: {
      market,
    }
  })
  console.log('updateUserMarkets res', res)
}

const getUserMarkets = async () => {
  let res = await doFetch('/api/usermarkets', {
    method: 'GET',
  })
  console.log('updateUserMarkets res', res)
}

const tradeSum = async () => {
  userAsset = Math.max(0, userAsset - 1);
  console.log('tradeSum userAsset', userAsset);
  await updateAsset(userAsset);
}

const tradeUserMarket = async (card: any, isYes: boolean) => {
  const userMarkets = await getUserMarkets();
  console.log('userMarkets', userMarkets);
  await updateUserMarkets({
    yesMarkets: isYes ? [card.id] : [],
    noMarkets: isYes ? [] : [card.id],
  });
}

// start transaction
const goDeposit = async (card: Card, isYes: boolean) => {
  if (path.includes("market") === "true") {
    return;
  }

  console.log('pdcCards', pdcCards, 'card', card);
  let currentIndex: any = pdcCards.findIndex((item: any) => item.id === card.id);
  if (currentIndex !== -1) {
    if (pdcCards[currentIndex]) {
      if (isYes) {
        pdcCards[currentIndex].yesNum += 1;
      } else {
        pdcCards[currentIndex].noNum += 1;
      }
    }
  }
  // console.log('currentCard', currentCard);
  await updateMarket(2, pdcCards)

  await tradeSum();

  await tradeUserMarket(card, isYes);

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

      <div v-if="pdcCards.length">
        <div v-for="(card, index) in pdcCards as cardsType" :key="card.id"
          :class="['card', 'draggable-element', 'shadow-md', { active: currentIndex === index }]"
          :style="getCardStyle(index)" @touchstart="(e) => _debounce(touchStart(e))"
          @touchmove="(e) => _debounce(touchMove(e))" @touchend="(e) => _debounce(touchEnd(card))">
          <van-image width="100%" height="50%" :src="card.image" class="p-2" fit="contain">
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

          <div v-if="card" class="px-4 h-[50%]">
            <div class="h-[85%] overflow-hidden">
              <!-- Title and question -->
              <div class="mh-[120px]">
                <p class="name">{{ card.title }}</p>
              </div>
              <!-- Yes and No button -->
              <div class="w-full h-16 z-50 mt-5">
                <div class="flex justify-between items-center h-full">
                  <div class="relative" @click="buyYes(card)">
                    <img class="h-[56px]" src="@/assets/icon/yes.png" alt="">
                    <span
                      class="absolute inset-0 flex items-center justify-center w-full h-full text-white text-xl font-bold">
                      Yes
                    </span>
                  </div>
                  <div class="relative" @click="buyNo(card)">
                    <img class="h-[56px]" src="@/assets/icon/no.png" alt="">
                    <span
                      class="absolute inset-0 flex items-center justify-center w-full h-full text-white text-xl font-bold">
                      No
                    </span>
                  </div>
                </div>
              </div>
              <!--Card information-->
              <div class="text-sm text-gray-500 mt-2">
                <div>
                  <span class="font-bold text-black">{{ card.yesNum }}</span>
                  <span> Yes Votes</span>
                </div>
                <div>
                  <span class="font-bold text-black">{{ card.noNum }}</span>
                  <span> No Votes</span>
                </div>
                <div>
                  <span> You have selected <span class="font-bold text-green-500">Yes</span></span>
                </div>
                <div>
                  <van-button size="mini" type="primary">Claim</van-button>
                </div>
              </div>


              <!-- Progress bar -->
              <!-- <SwipeCardProgressBar class="mt-5" :lastTradePrice="percentage(card?.markets[0].lastTradePrice, 'num')
              " /> -->
            </div>
            <!-- Volume and share button -->
            <div class="h-[15%] flex justify-between">
              <!-- <text> ${{ convertCurrency(card.volume) }} Vol.</text> -->
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
  font-size: 18px;
  font-weight: bold;
  display: block;
  line-height: 1.2;
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
  background-image: linear-gradient(to right, #1652F0, #1854ee);
}

.gradient-right {
  background-image: linear-gradient(to right, #D103FB, rgb(242, 111, 179));
}
</style>
