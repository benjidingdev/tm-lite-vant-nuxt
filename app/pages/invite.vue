<script setup>
import { useAccount } from "@wagmi/vue";
import { onMounted } from "vue";
const { userInfo } = $(userStore());
const { inviteCode } = userInfo;
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
  <div class="invite-dashboard-container bg-gray-100">
    <div class="emoji-container"></div>
    <div class="content-container text-center">
      <h1 class="text-4xl">Invite your friends to earn Tuit</h1>
      <p>Share your invite code with friends and earn TUIT when they join.</p>
      <van-button type="primary" size="large" @click="inviteUser"
        >Invite Now
      </van-button>
    </div>
    <div class="invite-status-container">
      <van-grid :column-num="2" :gutter="10">
        <van-grid-item
          v-for="value in 2"
          :key="value"
          icon="photo-o"
          text="claim"
        />
      </van-grid>
    </div>
  </div>
</template>

<style>
.invite-dashboard-container {
  height: calc(100vh - 130px);
}
</style>
