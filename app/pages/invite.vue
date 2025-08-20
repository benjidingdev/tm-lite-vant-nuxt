<script setup>
import { useAccount } from "@wagmi/vue";
import { onMounted } from "vue";

const { userInfo } = $(userStore());
const { token } = $(authStore());
const { connectWallet } = $(useWalletStore());
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
      <img class="w-full mb-4 rounded-xl" src="@/assets/img/turingM.gif" />
      <h1 class="text-3xl pt-2 font-bold">{{ $t("Invite to earn TUIT") }}</h1>
      <p class="text-lg text-gray-600 my-3">{{ $t("inviteDescription") }}</p>

      <div v-if="!token.accessToken">
        <van-button type="primary" size="large" @click="connectWallet">{{
          $t("Login")
        }}</van-button>
      </div>
      <div v-else>
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
