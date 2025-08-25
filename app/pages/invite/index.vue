<script setup>
import { useAccount } from "@wagmi/vue";
import { onMounted } from "vue";

const { userInfo } = $(userStore());
const { token } = $(authStore());
const { connectWallet } = $(walletStore());
const { setModal } = $(uiStore());
const defaultTUIT = $ref("00000");

const { inviteCode, inviteCount } = userInfo;

const earnedTUIT = $computed(() => {
  return !!inviteCount ? inviteCount * 5 : "00000";
});

const inviteUser = () => {
  const botUsername = "turingM_lite_bot";
  const appShortName = "tmLite";
  const params = `inviteCode=${inviteCode || "ChGQnC"}`;
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
</script>

<template>
  <div class="invite-dashboard-container bg-white p-2 overflow-auto">
    <div class="broadcast-container mb-2">
      <van-notice-bar left-icon="volume-o" :scrollable="false">
        <van-swipe
          vertical
          class="notice-swipe h-[40px] leading-10"
          :autoplay="3000"
          :touchable="false"
          :show-indicators="false"
        >
          <van-swipe-item
            >User1 got 1000 TUIT invited AAA successfully!</van-swipe-item
          >
          <van-swipe-item
            >User1 got 1000 TUIT invited BBB successfully!</van-swipe-item
          >
          <van-swipe-item
            >User1 got 1000 TUIT invited CCC successfully!</van-swipe-item
          >
        </van-swipe>
      </van-notice-bar>
    </div>
    <div class="content-container text-center">
      <img
        class="w-[70px] m-auto rounded-full transform transition-transform duration-1000 hover:rotate-y-180"
        src="@/assets/img/gold-coins.jpg"
      />
      <h1 class="text-3xl pt-2 font-bold">{{ $t("GOT 100 TUIT NOW") }}</h1>
      <p class="text-lg text-gray-600 my-3">{{ $t("inviteDescription") }}</p>

      <div v-if="!token.accessToken">
        <van-button
          type="primary"
          size="large"
          @click="setModal('loginModal', true)"
          >{{ $t("Login") }}</van-button
        >
      </div>
      <div v-else class="px-4">
        <div class="invite-status-container text-center text-gray-500 mt-4">
          <div class="text-xl font-bold text-blue pt-4">
            {{ $t("Your TUIT") }}
          </div>
          <van-rolling-text
            class="my-rolling-text"
            :height="54"
            :start-num="defaultTUIT"
            :target-num="earnedTUIT"
          />
        </div>
        <van-button type="primary" size="large" @click="inviteUser">{{
          $t("Invite Now")
        }}</van-button>
      </div>
    </div>
    <div class="invite-info-container mt-6">
      <p class="px-4 pb-2 text-gray-400">You have invited:</p>
      <van-cell-group>
        <van-cell title="1. Ben" value="+10 TUIT" />
        <van-cell title="2. Prediction" value="+20 TUIT" />
      </van-cell-group>
    </div>
  </div>
</template>

<style>
.invite-dashboard-container {
  height: calc(100vh - 130px);
}
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
