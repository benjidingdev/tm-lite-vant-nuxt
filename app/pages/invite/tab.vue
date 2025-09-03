<script setup>
import Request from '@/utils/request'

let { userInfo, fatherInviteCode } = $(userStore());
const { token } = $(authStore());
const { setModal } = $(uiStore());

const inviteBalance = $computed(() => {
  return (userInfo.inviteCount || 0) * 10;
})

const inviteUser = () => {
  const botUsername = "turingM_lite_bot";
  const appShortName = "tmLite";
  const params = `inviteCode=${userInfo.inviteCode || "ChGQnC"}`;
  const miniAppUrl = `https://t.me/${botUsername}/${appShortName}?startapp=${params}`;
  const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(
    miniAppUrl
  )}`;
  if (window.Telegram) {
    Telegram.WebApp.openTelegramLink(shareUrl);
  } else {
    window.open(shareUrl);
  }
};

let shareUserList = $ref([]);
async function loadShareUser() {
  try {
    const rz = await Request({
      url: `/app-api/topic/user/shareUserPage`,
      method: 'post',
      data: {
        pageNo: 1,
        pageSize: 12
      }
    })
    console.log('loadShareUser', userInfo.inviteCode, rz);

    if (rz.data.list) {
      shareUserList = [
        ...rz.data.list,
      ];
      userInfo.inviteCount = rz.data.total;
    }
  } catch (e) {

  }
}

onMounted(async () => {
  console.log('inviteCode', userInfo.inviteCode, fatherInviteCode);

  if (token.accessToken) {
    await loadShareUser();
  }
})
</script>

<template>
  <div class="layout-height bg-white p-2 overflow-auto">
    <div class="broadcast-container mb-2">
      <van-notice-bar left-icon="volume-o" :scrollable="false">
        <van-swipe vertical class="notice-swipe h-[40px] leading-10" :autoplay="3000" :touchable="false"
          :show-indicators="false">
          <van-swipe-item>User1 got 1000 TUIT invited AAA successfully!</van-swipe-item>
          <van-swipe-item>User1 got 1000 TUIT invited BBB successfully!</van-swipe-item>
          <van-swipe-item>User1 got 1000 TUIT invited CCC successfully!</van-swipe-item>
        </van-swipe>
      </van-notice-bar>
    </div>

    <div class="content-container text-center">
      <img class="w-[70px] m-auto rounded-full transform transition-transform duration-1000 hover:rotate-y-180"
        src="@/assets/img/gold-coins.jpg" />
      <h1 class="text-3xl pt-2 font-bold">{{ $t("GOT 100 TUIT NOW") }}</h1>
      <p class="text-sm text-gray-600 my-3 px-4">{{ $t("inviteDescription") }}</p>

      <div v-if="!token.accessToken">
        <van-button type="primary" size="large" @click="setModal('loginModal', true)">{{ $t("Login") }}</van-button>
      </div>
      <div v-else class="px-4">
        <div class="invite-status-container text-center text-gray-500 mt-4">
          <div class="text-xl font-bold text-blue pt-4">
            {{ $t("Your TUIT") }}
          </div>
          <van-rolling-text class="my-rolling-text" :height="54" :start-num="0" :target-num="inviteBalance" />
        </div>
        <van-button type="primary" size="large" @click="inviteUser">{{
          $t("Invite Now")
          }}</van-button>
      </div>
    </div>

    <div class="invite-info-container mt-6" v-if="shareUserList.length > 0">
      <p class="px-4 pb-2 text-gray-400">{{ $t('You have invited:') }}</p>

      <article class="space-y-4 text-gray-600">
        <div v-for="item in shareUserList" :key="item.id" class="flex items-center justify-between px-5">
          <div class="flex items-center space-x-1">
            <img class="w-4 h-4 rounded-full" :src="item.avatar" alt="">
            <p>{{ item.nickname }}</p>
          </div>

          <div>+10 TUIT </div>
        </div>
      </article>
    </div>
  </div>
</template>

<style>
.my-rolling-text {
  --van-rolling-text-background: transparent;
  --van-rolling-text-color: #1989fa;
  --van-rolling-text-font-size: 24px;
  --van-rolling-text-gap: 3px;
  --van-rolling-text-item-border-radius: 5px;
  --van-rolling-text-item-border: 1px solid #1989fa;
  --van-rolling-text-item-width: 40px;
}
</style>
