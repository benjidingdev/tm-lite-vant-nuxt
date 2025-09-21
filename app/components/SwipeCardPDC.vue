<script setup lang="ts">
import { convertCurrency, percentage } from "@/utils/processing";
import { _debounce } from "@/utils/debounce";
import _ from 'lodash'
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
let firstCardIndex = 0; // The index of current card
let offsetX = $ref(0); // The value  of offsetX
let offsetY = $ref(0); // The value  of offsetY
let startX = $ref(0); // The value of startX
let startY = $ref(0); // The value of startY
let claimedTopicIds = $ref([]);
let isSettlement = $ref(false);
const customMarkets: any = $ref(markets());
let isTrading = $ref(false);

const threshold = 100; // Threshold of swiping
// The data from store
let { isLoading } = $(requestQueueStore());
const { x_user } = $(supabaseStore())
let { pdcCards, yesMarkets, noMarkets }: any = $(pdcSwipeCardStore());
const route = useRoute()

const topicsId = 2; // default topic id
let currentX = 0;
let currentY = 0;

let currentCardID = $ref(0);

let queryParams: any = {
  cardID: "",
  inviteCode: "",
};
let { pAmount } = $(pdcSwipeCardStore())
const { query, path } = $(useRoute());
let movingYes = $computed(() => offsetX < 0);
let movingNo = $computed(() => offsetX > 0);
let movingNext = $computed(() => offsetY > 50 || offsetY < -50);
let isFinished = $computed(() => claimedTopicIds?.some(item => item == route.params.pid));

const updateMarket = async (topicId: number, markets: any) => {
  await doFetch('/api/topics/updateTopic', {
    method: 'POST',
    body: {
      topicId,
      markets,
    }
  })
}

const getMarket = async (topicId: any) => {
  let res: any = await doFetch(`/api/topics/${topicId}`, {
    method: 'GET',
  })
  const markets = res?.data?.markets || [];
  return markets;
}

// get the list of cards
const getInfoList = async () => {
  pdcCards = await getMarket(topicsId);

  if (customMarkets?.length !== pdcCards.length) {
    await updateMarket(topicsId, customMarkets);
    pdcCards = await getMarket(topicsId);
  }
  const index = pdcCards.findIndex((card: any) => card.id == query.marketID)
  if (index > -1) {
    pdcCards.unshift(pdcCards[index]); // add
  }

  isLoading = false;
};

// Obtain the style of card
const getCardStyle = (index: number) => {
  if (index === firstCardIndex) {
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
  if (firstCardIndex >= pdcCards.length) return;
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
  offsetX = 0;
  offsetY = 0;
};

// Touch move
const touchMove = (e: TouchEvent | any) => {
  if (firstCardIndex >= pdcCards.length) return;

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
  if (firstCardIndex >= pdcCards.length) return;
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
    // how to update the pdcCards without changing the value of pdccard
    pdcCards.shift();
  }, 0);
};

async function trade(marketId: any, isYes: any) {
  try {
    const rz = await doFetch(`/api/pd/topic/${route.params.pid}`, {
      method: 'POST',
      body: JSON.stringify({
        action: 'topic-market-trade',
        marketId: marketId,
        isYes: isYes,
      })
    })
    if (rz.status === 200) {
      useConfetti();
    }
    pickNext();
  } catch (error) {
    showToast('You have already traded this market or server error!');
    pickNext();
  }
}

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
  currentCardID = card.id;
  if (getUserSelectedStatus(currentCardID) !== '') {
    pickNext();
    return;
  }

  isTrading = true;
  try {
    if (path.includes("market") === "true") {
      return;
    }

    pAmount = Math.max(0, pAmount - 100);
    if (pAmount === 0) {
      showToast("You don't have enough PDC, please go to market page to get more.");
      resetCard();
      closeToast();
      return;
    }

    const rz = await trade(card.id, isYes);
    console.log('trade result', rz)
  } catch (error) {
    resetCard();
  } finally {
    resetCard();
    isTrading = false;
    closeToast();
  }
};

// const getAsset = async () => {
//   let res = await doFetch(`/api/assets/getAsset`, {
//     method: 'GET',
//   })
//   if (res.status === 200) {
//     const asset = res?.data?.pAmount || 0;
//     pAmount = asset;
//   } else {
//     pAmount = 0;
//   }
//   return res;
// }

const getUserMarkets = async () => {
  let res = await doFetch('/api/usermarkets', {
    method: 'GET',
  })

  if (res?.status === 200) {
    yesMarkets = res?.data[0]?.yesMarkets || [];
    noMarkets = res?.data[0]?.noMarkets || [];
    claimedTopicIds = res?.data[0]?.claimedTopicIds || [];
  } else {
    return [];
  }
}

const getUserSelectedStatus = (currentCardID: any) => {
  if (yesMarkets.concat(noMarkets).includes(currentCardID)) {
    return yesMarkets.includes(currentCardID) ? "Yes" : "No";
  }
  return '';
}

const claim = async () => {
  try {
    const rz = await doFetch(`/api/pd/topic/${route.params.pid}`, {
      method: 'POST',
      body: JSON.stringify({
        action: 'topic-market-claim'
      })
    });
    if (rz?.status === 200 && rz?.msg === "claim got!") {
      useConfetti();
    } else {
      showToast(rz?.msg);
    }
  } catch (error) {
    showToast('Calim failed!');
    closeToast();
  }
}

onMounted(async () => {
  await getInfoList();
  await getUserMarkets();
  await getAsset();
  queryParams = getFatherInviteCode();
});
</script>

<template>
  <!-- <OnboardingGuide /> -->
  <div class="w-full h-[400px] relative z-10!">
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
      <div v-if="isFinished">
        <div class="card draggable-element shadow-md active">
          <van-empty image="https://fastly.jsdelivr.net/npm/@vant/assets/custom-empty-image.png" image-size="80"
            description="Waiting for next reward!" />
        </div>
      </div>
      <div v-else-if="pdcCards.length">
        <div v-for="(card, index) in pdcCards as cardsType" :key="card.id"
          :class="['card', 'draggable-element', 'shadow-md', { active: firstCardIndex === index }]"
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

          <div v-if="card" class="px-4">
            <div class="overflow-hidden">
              <!-- Title and question -->
              <div class="mh-[120px]">
                <p class="name">{{ card.title }}</p>
              </div>
              <div class="w-full h-16 z-50 mt-5 relative">
                <div class="flex justify-between items-center h-full">
                  <div class="relative" @click="buyYes(card)">
                    <img class="h-[56px]" src="@/assets/icon/yes.png" alt="">
                    <span
                      class="absolute inset-0 flex items-center justify-center w-full h-full text-white text-xl font-bold">
                      Yes({{ card.yesNum }})
                    </span>
                  </div>
                  <div class="relative" @click="buyNo(card)">
                    <img class="h-[56px]" src="@/assets/icon/no.png" alt="">
                    <span
                      class="absolute inset-0 flex items-center justify-center w-full h-full text-white text-xl font-bold">
                      No({{ card.noNum }})
                    </span>
                  </div>
                </div>
                <!--selected status-->
                <div v-if="getUserSelectedStatus(card.id) === 'Yes' || getUserSelectedStatus(card.id) === 'No'"
                  :class="getUserSelectedStatus(card.id) === 'Yes' ? 'bg-green-600' : 'bg-red-600'"
                  class="absolute top-[2px] right-0 bottom-[2px] font-bold left-0 opacity-85 rounded-lg flex items-center justify-center text-2xl">
                  {{ getUserSelectedStatus(card.id) }}
                </div>
                <!--loading on buttons-->
                <div v-if="isTrading"
                  class="absolute top-[2px] right-0 bottom-[2px] left-0 bg-gray-500 opacity-85 rounded-lg flex items-center justify-center">
                  trading...
                </div>
              </div>
              <!--next click-->
              <div class="text-gray-400 underline text-right" @click="pickNext">next>></div>
            </div>
          </div>
        </div>
      </div>

      <div v-else>
        <van-empty description="If you are interested in Turing Market, please go to our official version"
          style="--van-empty-description-color: #7e7e7e">
          <template #image>
            <img src="/assets/icon/logo.svg" />
          </template>
          <van-button round type="primary" class="bottom-button" @click="navigateTo('/pd')">Go to
            watinglist</van-button>
        </van-empty>
      </div>

    </van-skeleton>
  </div>
  <van-button v-if="!isLoading" type="primary"
    class="w-full px-4 mt-4! bg-blue-500 text-white  rounded-[8px]! bg-[#7000FF]" :disabled="isFinished" @click="claim">
    {{ isFinished ? 'You have got 200 $PM!' : 'Claim your $PM now!' }}
  </van-button>
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
  color: #333;
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
