<script setup>
const cards = ref([]);

let currentIndex = ref(0); // The index of current card
let offsetX = ref(0); // The value of offsetX
let offsetY = ref(0); // The value of offsetY
let startX = ref(0); // The value of startX
let startY = ref(0); // The value of startY
let lastPage = ref(false);
let refresherTriggered = ref(false);

const getInfoList = async (refresh) => {
  if (refresh) {
    lastPage.value = false;
    refresherTriggered.value = true;
  }

  const { data, error, loading } = await useFetch(
    "https://unidemo.dcloud.net.cn/api/news?column=title,author_name,cover,published_at"
  );
  if (error.value) {
    console.error("Error fetching data:", error.value);
    return;
  }
  if (data.value) {
    const result = data.value;
    console.log(result);
    if (result !== null) {
      if (refresh) {
        cards.value = result;
      } else {
        if (result.length == 0) {
          lastPage.value = true;
        } else {
          result.forEach((e) => {
            cards.value.push(e);
          });
        }
      }
    }
  }
};
// Obtain the style of card
const getCardStyle = (index) => {
  if (index === currentIndex.value) {
    return {
      transform: `translateX(${offsetX.value}px) rotate(${
        offsetX.value / 20
      }deg)`,
      zIndex: 100 - index,
    };
  }

  return {
    zIndex: 100 - index,
  };
};

// Touch start
const touchStart = (e) => {
  if (currentIndex.value >= cards.value.length) return;

  startX.value = e.touches[0].clientX;
  startY.value = e.touches[0].clientY;
  offsetX.value = 0;
  offsetY.value = 0;
  console.log(startX.value, startY.value);
};

// Touch move
const touchMove = (e) => {
  if (currentIndex.value >= cards.value.length) return;

  const currentX = e.touches[0].clientX;
  const currentY = e.touches[0].clientY;

  offsetX.value = currentX - startX.value;
  offsetY.value = currentY - startY.value;

  // limit the offset value
  const maxOffset = 150;
  if (Math.abs(offsetX.value) > maxOffset) {
    offsetX.value = offsetX.value > 0 ? maxOffset : -maxOffset;
  }
};

// Touch end
const touchEnd = () => {
  if (currentIndex.value >= cards.value.length) return;

  const threshold = 80; // Threshold of swiping

  if (offsetX.value > threshold) {
    buyYes(); // swipe to right means accept
  } else if (offsetX.value < -threshold) {
    buyNo(); // swipe to left means reject
  } else {
    resetCard(); // reset
  }
};

const buyYes = () => {
  swipeCard(true);
};

const buyNo = () => {
  swipeCard(false);
};

const bookmark = () => {};

// Card swipe Animation
const swipeCard = (isLike) => {
  const direction = isLike ? 1 : -1;
  offsetX.value = direction * 500;

  // Switch to next card after 0.3 second
  setTimeout(() => {
    offsetX.value = 0;

    // The result of card swiping
    if (currentIndex.value >= cards.value.length) {
      uni.showToast({
        title: "no more cards",
        icon: "none",
      });
    }
    cards.value.shift();
  }, 300);
};

// reset the position of cards
const resetCard = () => {
  offsetX.value = 0;
  offsetY.value = 0;
};

onMounted((e) => {
  getInfoList(false);
});
</script>

<template>
  <div class="w-full h-full relative">
    <div
      v-for="(item, index) in cards"
      :key="item.id"
      :class="['card', { active: currentIndex === index }]"
      :style="getCardStyle(index)"
      @touchstart="touchStart"
      @touchmove="touchMove"
      @touchend="touchEnd"
    >
      <van-image width="100%" height="61.8%" :src="item['cover']">
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
              <van-icon
                name="checked"
                size="66"
                color="#97dbb4"
              />
            </div>
            <div
              class="rounded-full bg-white w-15 h-15 flex justify-center items-center shadow-lg"
              @click="buyNo"
            >
              <van-icon
                name="clear"
                size="66"
                color="#fe9595"
              />
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
        <text class="name">{{ item.title }},{{ item.author_name }}</text>
        <text class="desc">{{ item.content }}</text>
      </div>

      <div v-if="currentIndex === index" class="hint-box">
        <div class="hint like" :style="{ opacity: offsetX / 150 }">YES</div>
        <div class="hint nope" :style="{ opacity: -offsetX / 150 }">NO</div>
      </div>
    </div>
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

.card-image {
  width: 100%;
  height: 80%;
  object-fit: cover;
}

.name {
  font-size: 20px;
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
}

.desc {
  font-size: 14px;
  display: block;
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

/* .btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
} */

.btn.like {
  border: 2px solid #52c41a;
}

.btn.nope {
  border: 2px solid #ff4d4f;
}

.btn.bookmark {
  border: 2px solid yellow;
}
</style>