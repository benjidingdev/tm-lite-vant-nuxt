<script setup>
import { useAccount } from "@wagmi/vue";
import { onMounted } from "vue";
const { userInfo } = $(userStore());
const inviteUser = () => {
  window.open(
    `https://t.me/share?url=https://t.me/turingM_lite_bot/tmLite?inviteCode=${userInfo.inviteCode}`
  );
};
onMounted(() => {
  if (window.Telegram) {
    console.log(
      "window.Telegram.WebApp.initDataUnsafe",
      window.Telegram.WebApp.initDataUnsafe
    );
    console.log("window.location", window.location.search);
  }
});
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
