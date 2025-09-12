<script setup lang="ts">
import { shortenHash } from "@/utils/processing";
const { modalIsShow } = $(uiStore());
const hash = import.meta.env.NUXT_PUBLIC_HASH;
const branch = import.meta.env.NUXT_PUBLIC_BRANCH;
let clickNum = 0;

const shortHash = $computed(() => shortenHash(hash, 10));
let { startParam } = $(shareStore());
const { token } = $(authStore());
const initVconsole = async () => {
  clickNum++;
  if (clickNum < 3) return;
  const vConsole = new VConsole();
};

const { locale } = $(useI18n())

const openTab = () => {
  window.open(
    'https://docs-zh.turingm.io/users-guide/lite',
    "TuringUserGuideLite",
    "width=600,height=800"
  );
}
</script>
<template>
  <van-popup v-model:show="modalIsShow.settings" position="right" :style="{ width: '80%', height: '100%' }">
    <div class="flex flex-col justify-around h-dvh relatvie">
      <span class="text-gray-200 absolute z-99 opacity-70 w-full flex justify-center px-5">{{ startParam }}</span>
      <div class="flex-1">
        <LangSwitcherLabel />
        <TradeSettingLabel />
        <van-cell :title="$t('Topic Voting')" is-link @click="goToLInk('/advise', locale)" />
        <van-cell :title="$t('Initiate a topic')" is-link @click="goToLInk('/advise/launch', locale)" />
        <van-cell :title="$t('Users Guide')" is-link @click="openTab" v-if="locale === 'zh-TW'" />
        <AuthLogoutLabel v-if="token.accessToken" />
      </div>
      <van-cell-group>
        <van-cell :title="$t('Branch')" :value="branch" @click="initVconsole" />
        <van-cell :title="$t('Hash')" :value="shortHash" />
      </van-cell-group>
    </div>
  </van-popup>
</template>
