<script setup lang="ts">
import { formatTitle } from "@/utils/processing";
const { modalIsShow } = $(uiStore());
let marketId = $ref(0);
const { userInfo } = $(userStore());

const goUrl = (url) => {
  let path = `${url}?url=${origin}?inviteCode=${userInfo.inviteCode}&text=Get Start With Turing Market`;
  origin = `${origin}/marketsDetails`;
  path = `${url}?url=${origin}?id=${marketId}`;
  window.open(path);
};
</script>

<template>
  <van-dialog
    v-model:show="modalIsShow.share"
    :title="$t('SHARE TO')"
    :confirmButtonText="$t('Confirm')"
  >
    <div class="w-full pb-2 px-10">
      <div class="font-sans text-center text-white text-lg font-bold">
        {{ $t("SHARE TO") }}
      </div>
      <div class="flex justify-between w-full py-4">
        <img
          class="w-12 h-12 bg-cover"
          src="@/assets/img/telegran.png"
          @click="goUrl('https://t.me/share/url')"
        />
        <img
          class="w-12 h-12 bg-cover"
          src="@/assets/img/twitter.png"
          @click="goUrl('https://twitter.com/intent/tweet')"
        />
        <img
          class="w-12 h-12 bg-cover"
          src="@/assets/img/whatsapp.png"
          @click="goUrl('https://api.whatsapp.com/send')"
        />
      </div>
    </div>
  </van-dialog>
</template>
