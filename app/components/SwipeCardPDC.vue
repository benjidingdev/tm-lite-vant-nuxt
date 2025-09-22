<script setup lang="ts">
import _ from 'lodash'

const { topic } = $defineProps<{
  topic: any
}>()

const route = useRoute()
let markets = $ref(topic?.markets || [])
let { pAmount, yesMarkets, noMarkets }: any = $(pmDataStore());

let offset = $ref({ X: 0, Y: 0 });
let isTrading = $ref(false)
let isSettlement = $ref(false)  //

let threshold = { X: 100, Y: 100 };
let movingYes = $computed(() => isSettlement && offset.X < 0);
let movingNo = $computed(() => isSettlement && offset.X > 0);
const movingNext = $computed(() => offset.Y > 50 || offset.Y < -50);
const userSelectedMarkets = $computed(() => yesMarkets.concat(noMarkets));

let start = { X: 0, Y: 0 }
const touchStart = (e: TouchEvent | any) => {
  const { clientX, clientY } = e.touches[0];
  start.X = clientX;
  start.Y = clientY;
  offset.X = 0;
  offset.Y = 0;
};

const touchMove: any = (e: TouchEvent | any) => {
  const { clientX, clientY } = e.touches[0];
  offset.X = clientX - start.X;
  offset.Y = clientY - start.Y;

  if (Math.abs(offset.X) > threshold.X) {
    offset.X = offset.X > 0 ? threshold.X : -threshold.X;
    isSettlement = true;
  } else {
    isSettlement = false;
  }
  if (Math.abs(offset.Y) > threshold.Y) {
    offset.Y = offset.Y > 0 ? threshold.Y : -threshold.Y;
  }
};

const touchEnd = (card: any) => {
  if (offset.X >= threshold.X) {
    goDeposit(card, false); // swipe to left means reject
  } else if (offset.X <= -threshold.X) {
    goDeposit(card, true); // swipe to right means accept
  } else if (offset.Y >= threshold.Y - 50) {
    swipeCard(); // swipe down means pick next card
  } else if (offset.Y <= -threshold.Y + 50) {
    swipeCard(); // swipe up means bookmark
  } else {
    resetCard(); // reset the position of card
  }
};

const swipeCard = () => {
  let direction = -1;
  offset.X = direction * 500;
  offset.Y = direction * 500;
  // Switch to next card after 0.3 second
  setTimeout(() => {
    offset.X = 0;
    offset.Y = 0;
    // how to update the $PCards without changing the value of $Pcard
    const market = markets.shift();
    markets.push(market);
  }, 0);
};

const resetCard = () => {
  offset.X = 0;
  offset.Y = 0;
};

async function trade(marketId: any, isYes: any) {
  try {
    const rz: any = await doFetch(`/api/topic/${route.params.id}`, {
      method: 'POST',
      body: JSON.stringify({
        action: 'topic-market-trade',
        marketId: marketId,
        isYes: isYes,
      })
    })
    if (rz?.status === 200) {
      useConfetti();
      pAmount -= 100;
    }
    swipeCard();
  } catch (error) {
    throw error;
  }
}

// start transaction
const goDeposit = async (card: any, isYes: boolean) => {
  if (userSelectedMarkets.includes(card.id)) {
    swipeCard();
    return;
  }

  isTrading = true;

  if (Math.max(0, pAmount - 100) < 0) {
    showToast("You don't have enough $P, please go to market page to get more.");
    resetCard();
    closeToast();
    return;
  }
  try {
    resetCard();
    await trade(card.id, isYes);
  } catch (error) {
    showToast("Update $P amount failed, please try again.");
    return;
  } finally {
    isTrading = false;
    resetCard();
    closeToast();
  }
};

const getUserMarkets = async () => {
  let res: any = await doFetch('/api/usermarkets', {
    method: 'GET',
  })

  if (res?.status === 200) {
    yesMarkets = res?.data[0]?.yesMarkets || [];
    noMarkets = res?.data[0]?.noMarkets || [];
  } else {
    return [];
  }
}

onMounted(async () => {
  await getUserMarkets();
});
</script>

<template>
  <div v-if="topic.meta.status !== 'started'" class="w-full h-full flex flex-col justify-center items-center mt-6">
    <article class="w-full h-[400px] relative z-10!">
      <section v-if="markets.length">
        <div v-for="(card, index) in markets" :key="card.id"
          class="absolute w-full h-full bg-white rounded-[15px] overflow-hidden transition-all duration-300 ease-in-out shadow-md will-change-transform touch-action-none transform-gpu backface-hidden contain-content"
          :style="{
            'z-index': 30 - index,
            transform: index == 0 ?
              `translateX(${offset.X}px) translateY(${offset.Y}px) rotate(${offset.X / 20}deg)`
              : `translateX(${0}px) translateY(${1 * index}px)`
          }" @touchstart="touchStart" @touchmove="(e) => _debounce(touchMove(e))" @touchend="touchEnd(card)">

          <van-image width="100%" height="60%" :src="card.image" class="p-2" fit="contain">
            <div v-if="index === 0" class="hint-box">
              <div v-if="movingYes" class="hint-box hint font-bold text-white border-white bg-[var(--user-selected-yes-color)]">
                YES
              </div>
              <div v-else-if="movingNo" class="hint-box hint font-bold  text-white border-white bg-[var(--user-selected-no-color)]">
                NO
              </div>
              <div v-else-if="movingNext" class="hint-box hint font-bold  text-white border-white bg-[var(--user-selected-next-color)]">
                NEXT</div>
            </div>
          </van-image>

          <div class="overflow-hidden px-4">
            <div class="mh-[120px] text-center">
              <div class="items-center flex justify-center">
                <div class="text-gray-900 flex items-center justify-between">{{ card.title }}</div>
                <a v-if="card.xUrl" :href="card.xUrl" class="p-2" target="_blank">
                  <van-icon name="/icons/x.svg" />
                </a>
              </div>
            </div>

            <div class="w-full h-16 z-50 mt-5 relative">
              <!--loading on buttons-->
              <div v-if="isTrading" class="h-full bg-gray-500 opacity-85 rounded-lg flex items-center justify-center">
                trading...
              </div>

              <template v-else>
                <!--selected status-->
                <div v-if="userSelectedMarkets.includes(card.id)"
                  :class="(yesMarkets.includes(card.id)) ? 'text-[var(--turing-purple-color)]' : 'text-[#B30FE7]'"
                  class="h-full font-bold left-0 rounded-lg flex items-center justify-center text-xl"
                  @click="">
                  YOU SELECTED {{ yesMarkets.includes(card.id) ? 'YES' : 'NO' }}({{ card.yesNum }})
                </div>

                <div v-else class="flex justify-between items-center h-full">
                  <div class="relative cursor-pointer" @click="goDeposit(card, true)">
                    <img class="h-[56px]" src="@/assets/icon/yes.png" alt="">
                    <span
                      class="absolute inset-0 flex items-center justify-center w-full h-full text-white text-xl font-bold">
                      Yes({{ card.yesNum }})
                    </span>
                  </div>
                  <div class="relative cursor-pointer" @click="goDeposit(card, false)">
                    <img class="h-[56px]" src="@/assets/icon/no.png" alt="">
                    <span
                      class="absolute inset-0 flex items-center justify-center w-full h-full text-white text-xl font-bold">
                      No({{ card.noNum }})
                    </span>
                  </div>
                </div>
              </template>
            </div>

            <div class="text-gray-400 underline text-right cursor-pointer" @click="swipeCard">next>></div>
          </div>
        </div>
      </section>
    </article>
  </div>

</template>

<style scoped>
.hint-box {
  @apply absolute top-[2px] bottom-[2px] left-[2px] right-[2px] z-0 rounded-[15px] flex justify-center items-center;
}

.hint {
  @apply text-[36px] border-[3px] border-solid opacity-100 transition-opacity duration-300
}

</style>
