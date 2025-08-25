<script setup lang="ts">
import { useAccount } from "@wagmi/vue";
import { onMounted } from "vue";

definePageMeta({
  layout: "invite",
});

const { userInfo } = $(userStore());
const { token } = $(authStore());
const { connectWallet } = $(walletStore());
const { setModal } = $(uiStore());
const { locale } = $(useI18n());

const { inviteCode, inviteCount } = userInfo;

const earnedTUIT = $computed(() => {
  return !!inviteCount ? inviteCount * 5 : "00000";
});

const goToLInk = async (path: string) => {
  const url = locale === "en" ? path : `/${locale}${path}`;
  await navigateTo(url);
};

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

const checkAuth = async () => {
  if (!token.accessToken) {
    setModal("loginMoadl", true, () => {
      inviteUser();
    });
  } else {
    inviteUser();
  }
};
</script>

<template>
  <div class="activity-container h-full flex flex-col">
    <div class="broadcast-container">
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
    <div
      class="h-full content-container text-center flex flex-col justify-center"
    >
      <div class="px-4 mx-6 bg-white rounded-2xl py-6">
        <img
          class="w-[70px] m-auto rounded-full rotate-image"
          src="@/assets/img/gold-coins.jpg"
        />
        <h1 class="text-3xl pt-2 font-bold">{{ $t("GOT 100 TUIT NOW") }}</h1>
        <p class="text-lg py-8 text-gray-600">{{ $t("inviteDescription") }}</p>
        <div>
          <van-button type="primary" size="large" @click="inviteUser">{{
            $t("Invite Now")
          }}</van-button>
        </div>
        <div class="w-full mt-4 flex justify-between items-center text-gray-500">
          <a
            class="text-xs underline underline-offset-2"
            @click="goToLInk('/invite')"
            >Check your AWARDS!</a
          >
          <img class="w-[26%] h-full" src="@/assets/img/logo-light.png" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.activity-container {
  height: 100vh;
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
@keyframes rotateYInfinite {
  from {
    transform: rotateY(0deg);
  }
  to {
    transform: rotateY(360deg);
  }
}
.rotate-image {
  animation: rotateYInfinite 2s linear infinite;
}
</style>
