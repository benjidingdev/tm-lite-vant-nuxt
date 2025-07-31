<template>
  <div class="w-full h-full relative">
    <div
      v-for="(card, index) in cards"
      :key="card.id"
      :class="['card', { active: currentIndex === index }]"
      :style="getCardStyle(index)"
      class="shadow-xl"
      @touchstart="touchStart"
      @touchmove="touchMove"
      @touchend="touchEnd"
    >
      <van-image width="100%" height="61.8%" :src="card['image']">
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
              @click="buyYes"
            >
              <van-icon name="checked" size="66" color="#97dbb4" />
            </div>
            <div
              class="rounded-full bg-white w-15 h-15 flex justify-center items-center shadow-lg"
              @click="buyNo"
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
      <div class="absolute bottom-0 left-0 right-0 p-4">
        <text class="name">{{ card.title }}</text>
        <text class="desc">{{ card.content }}</text>
      </div>

      <div v-if="currentIndex === index" class="hint-box">
        <div class="hint like" :style="{ opacity: offsetX / 150 }">YES</div>
        <div class="hint nope" :style="{ opacity: -offsetX / 150 }">NO</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { getTopicsRecommend } from "~/api/market";

const statusList = ["YES", "NO", "BOOKMARK", "NEXT"];

let cards = $ref([]);
let currentIndex = $ref(0); // The index of current card
let offsetX = $ref(0); // The value  of offsetX
let offsetY = $ref(0); // The value  of offsetY
let startX = $ref(0); // The value of startX
let startY = $ref(0); // The value of startY
let lastPage = $ref(false);
let refresherTriggered = $ref(false);
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
      transform: `translateX(${offsetX}px) translateY(${offsetY}px) rotate(${
        offsetX / 20
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
const touchStart = (e) => {
  if (currentIndex >= cards.length) return;

  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
  offsetX = 0;
  offsetY = 0;
  console.log(startX, startY);
};

// Touch move
const touchMove = (e) => {
  if (currentIndex >= cards.length) return;

  const currentX = e.touches[0].clientX;
  const currentY = e.touches[0].clientY;

  offsetX = currentX - startX;
  offsetY = currentY - startY;

  const maxOffsetX = 150;
  const maxOffsetY = 150;
  if (Math.abs(offsetX) > maxOffsetX) {
    offsetX = offsetX > 0 ? maxOffsetX : -maxOffsetX;
  }
  if (Math.abs(offsetY) > maxOffsetY) {
    offsetY = offsetY > 0 ? maxOffsetY : -maxOffsetY;
  }
};

// Touch end
const touchEnd = () => {
  if (currentIndex >= cards.length) return;

  const threshold = 80; // Threshold of swiping

  if (offsetX > threshold) {
    buyYes(); // swipe to right means accept
  } else if (offsetX < -threshold) {
    buyNo(); // swipe to left means reject
  } else if (offsetY > threshold) {
    pickNext(); // swipe down means pick next card
  } else if (offsetY < -threshold) {
    bookmark(); // swipe up means bookmark
  } else {
    resetCard(); // reset the position of card
  }
};

// Card swipe Animation
const swipeCard = (status) => {
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
      uni.showToast({
        title: "no more cards",
        icon: "none",
      });
    }
    cards.shift();
  }, 0);
};

// reset the position of cards
const resetCard = () => {
  offsetX = 0;
  offsetY = 0;
};

const buyYes = () => {
  swipeCard(statusList[0]);
};

const buyNo = () => {
  swipeCard(statusList[1]);
};

const bookmark = () => {
  swipeCard(statusList[2]);
};

const pickNext = () => {
  swipeCard(statusList[3]);
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
</style>
