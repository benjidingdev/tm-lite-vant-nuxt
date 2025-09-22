<script setup lang="ts">
import _ from 'lodash'

const { topic } = $defineProps<{
  topic: any
}>()

const route = useRoute()
let markets = $ref(topic?.markets || [])
let { pAmount, yesMarkets, noMarkets }: any = $(pmDataStore());
const userSelectedMarkets = [...(yesMarkets || []), ...(noMarkets || [])]


let offset = $ref({ X: 0, Y: 0 });
let threshold = { X: 100, Y: 100 };

let isTrading = $ref(false)
let isSettlement = $ref(false)  //

let movingYes = $computed(() => isSettlement && offset.X < 0);
let movingNo = $computed(() => isSettlement && offset.X > 0);
const movingNext = $computed(() => offset.Y > 50 || offset.Y < -50);


let start = { X: 0, Y: 0 }
const touchStart = (e: TouchEvent | any) => {
  const { clientX, clientY } = e.touches[0];
  start.X = clientX;
  start.Y = clientY;
  offset.X = 0;
  offset.Y = 0;
};

const touchMove = (e: TouchEvent | any) => {
  (useDebounceFn(() => {
    const { clientX, clientY } = e.touches[0];
    offset.X = clientX - start.X;
    offset.Y = clientY - start.Y;
    console.log('touchMove', { clientX, clientY, offset })

    if (Math.abs(offset.X) > threshold.X) {
      offset.X = offset.X > 0 ? threshold.X : -threshold.X;
      isSettlement = true;
    } else {
      isSettlement = false;
    }
    if (Math.abs(offset.Y) > threshold.Y) {
      offset.Y = offset.Y > 0 ? threshold.Y : -threshold.Y;
    }
  }, 20))()
};

const touchEnd = (card: any) => {
  // useDebounceFn(() => {
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
  // }, 200)
};

const swipeCard = () => {
  let direction = -1;
  offset.X = direction * 500;
  offset.Y = direction * 500;
  // Switch to next card after 0.3 second
  setTimeout(() => {
    offset.X = 0;
    offset.Y = 0;
    // how to update the pdcCards without changing the value of pdccard
    markets.shift();
  }, 0);
};

const resetCard = () => {
  offset.X = 0;
  offset.Y = 0;
};

// start transaction
const goDeposit = async (card: any, isYes: boolean) => {
  if (userSelectedMarkets.includes(card.id)) {
    swipeCard();
    return;
  }

  isTrading = true;

  pAmount = Math.max(0, pAmount - 100);
  if (pAmount < 0) {
    showToast("You don't have enough PDC, please go to market page to get more.");
    resetCard();
    closeToast();
    return;
  }

  const rz: any = await doFetch(`/api/topic/${route.params.id}`, {
    method: 'POST',
    body: JSON.stringify({
      action: 'topic-market-trade',
      marketId: card.id,
      isYes: isYes,
    })
  }).catch((err) => {
    console.error(err)
    showToast('You have already traded this market or server error!');
  })

  if (rz.status === 200) {
    useConfetti();
  }
  swipeCard();
  console.log('trade result', rz)

  resetCard();
  isTrading = false;
  closeToast();

};

onMounted(async () => {
});
</script>

<template>
  <article class="w-full h-[400px] relative z-10!">
    <section v-if="markets.length">
      <div v-for="(card, index) in markets" :key="card.id"
        class="absolute w-full h-full bg-white rounded-[15px] overflow-hidden transition-all duration-300 ease-in-out shadow-md draggable-element"
        :style="{
          'z-index': 30 - index,
          transform: index == 0 ?
            `translateX(${offset.X}px) translateY(${offset.Y}px) rotate(${offset.X / 20}deg)`
            : `translateX(${0}px) translateY(${1 * index}px)`
        }" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd(card)">

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
          <div class="mh-[120px]">
            <p class="name">{{ card.title }}</p>
          </div>

          <div class="w-full h-16 z-50 mt-5 relative">
            <!--loading on buttons-->
            <div v-if="isTrading" class="h-full bg-gray-500 opacity-85 rounded-lg flex items-center justify-center">
              trading...
            </div>

            <template v-else>
              <!--selected status-->
              <div v-if="userSelectedMarkets.includes(card.id)"
                :class="(yesMarkets.includes(card.id)) ? 'bg-[#7000FF]' : 'bg-[#B30FE7]'"
                class="h-full font-bold left-0 rounded-lg flex items-center justify-center text-xl cursor-pointer text-white"
                @click="">
                Try Claim Now!
              </div>

              <div v-else class="flex justify-between items-center h-full">
                <div class="relative" @click="goDeposit(card, true)">
                  <img class="h-[56px]" src="@/assets/icon/yes.png" alt="">
                  <span
                    class="absolute inset-0 flex items-center justify-center w-full h-full text-white text-xl font-bold">
                    Yes({{ card.yesNum }})
                  </span>
                </div>
                <div class="relative" @click="goDeposit(card, false)">
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
</template>

<style>
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
