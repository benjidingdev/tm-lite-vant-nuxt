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
    markets.shift();
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
  <div v-if="topic?.meta?.isWaitingClosed" class="w-full h-full flex flex-col justify-center items-center mt-6">
    <article class="w-full h-[400px] relative z-10!">
      <section v-if="markets.length">
        <div v-for="(card, index) in markets" :key="card.id"
          class="absolute w-full h-full bg-white rounded-[15px] overflow-hidden transition-all duration-300 ease-in-out shadow-md draggable-element"
          :style="{
            'z-index': 30 - index,
            transform: index == 0 ?
              `translateX(${offset.X}px) translateY(${offset.Y}px) rotate(${offset.X / 20}deg)`
              : `translateX(${0}px) translateY(${1 * index}px)`
          }" @touchstart="touchStart" @touchmove="(e) => _debounce(touchMove(e))" @touchend="touchEnd(card)">

          <van-image width="100%" height="50%" :src="card.image" class="p-2" fit="contain">
            <div v-if="index === 0" class="hint-box">
              <div v-if="movingYes" class="hint-box hint like">
                YES
              </div>
              <div v-else-if="movingNo" class="hint-box hint nope">
                NO
              </div>
              <div v-else-if="movingNext" class="hint-box hint next">NEXT</div>
            </div>
          </van-image>

          <div class="overflow-hidden px-4">
            <div class="mh-[120px] text-center">
              <p class="text-[#333] text-[18px] font-bold block leading-[1.2]">{{ card.title }}</p>
            </div>

            <div class="w-full h-16 z-50 mt-5 relative">
              <!--loading on buttons-->
              <div v-if="isTrading" class="h-full bg-gray-500 opacity-85 rounded-lg flex items-center justify-center">
                trading...
              </div>

              <template v-else>
                <!--selected status-->
                <div v-if="userSelectedMarkets.includes(card.id)"
                  :class="(yesMarkets.includes(card.id)) ? 'bg-[var(--turing-purple-color)]' : 'bg-[#B30FE7]'"
                  class="h-full font-bold left-0 rounded-lg flex items-center justify-center text-xl cursor-pointer text-white"
                  @click="">
                  Try Claim Now!
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

      <section v-else>
        <van-empty description="If you are interested in Turing Market, please go to our official version"
          style="--van-empty-description-color: #7e7e7e">
          <template #image>
            <img src="/assets/icon/logo.svg" />
          </template>
          <van-button round type="primary" class="bottom-button" @click="navigateTo('/pd')">Go to
            watinglist</van-button>
        </van-empty>
      </section>
    </article>
  </div>

</template>

<style scoped>

.hint-box {
  @apply absolute top-[2px] bottom-[2px] left-[2px] right-[2px] z-0 rounded-[15px] flex justify-center items-center
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
</style>
