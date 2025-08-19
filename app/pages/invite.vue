<script setup>
import { useAccount } from "@wagmi/vue";
import { onMounted } from "vue";
const { userInfo } = $(userStore());
const { inviteCode } = userInfo;
const startNum = $ref("00000");
const targetNum = $ref("00050");
console.log("userInfo", userInfo, inviteCode);

const inviteUser = () => {
  const botUsername = "turingM_lite_bot";
  const appShortName = "tmLite";
  const params = `inviteCode=${inviteCode || "ChGQnC"}`;
  const miniAppUrl = `https://t.me/${botUsername}/${appShortName}?startapp=${params}`;
  const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(
    miniAppUrl
  )}`;
  console.log("shareUrl", shareUrl);
  if (window.Telegram) {
    Telegram.WebApp.openTelegramLink(shareUrl);
  } else {
    window.open(shareUrl);
  }
};
</script>

<template>
  <div class="invite-dashboard-container bg-white p-2">
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
      <h1 class="text-3xl pt-2 font-bold">{{ $t("invite.title") }}</h1>
      <p class="text-lg text-gray-600 my-3">{{ $t("invite.description") }}</p>
      <div class="invite-status-container text-center text-gray-500 mt-4">
        <div class="text-xl font-bold text-blue pt-4">
          {{ $t("invite.TUITBalance") }}
        </div>
        <van-rolling-text
          class="my-rolling-text"
          :height="54"
          :start-num="startnum"
          :target-num="targetNum"
        />
      </div>
      <van-button type="primary" size="large" @click="inviteUser">{{
        $t("invite.button")
      }}</van-button>
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
  --van-rolling-text-gap: 6px;
  --van-rolling-text-item-border-radius: 5px;
  --van-rolling-text-item-border: 1px solid #1989fa;
  --van-rolling-text-item-width: 40px;
}
</style>
