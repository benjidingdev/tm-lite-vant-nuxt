<script setup lang="ts">
import "@vant/touch-emulator";
import { Locale } from "vant";
import enUS from "vant/es/locale/lang/en-US";
import zhTW from "vant/es/locale/lang/zh-TW";
import jaJP from "vant/es/locale/lang/ja-JP";
import koKR from "vant/es/locale/lang/ko-KR";
import { useRouteQuery } from '@vueuse/router'

const { token } = $(authStore());
const { userInfo } = $(userStore())
const href = useRequestURL().href
const origin = useRequestURL().origin

useHead({
  title: "Turing Market | Mini Dapp",
  meta: [
    {
      name: "viewport",
      content:
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, viewport-fit=cover",
    },
    // Open Graph
    { name: 'description', content: () => 'Bet on your beliefs!' },
    { property: 'og:title', content: () => 'Turing Market' },
    { property: 'og:description', content: () => 'Bet on your beliefs!' },
    { property: 'og:image', content: () => `${origin}/media/twitter-card.png` },
    { property: 'og:url', content: () => `${href}${token.accessToken !== '' ? '?inviteCode=' + userInfo?.inviteCode : ''}` },
    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' }, // 或 'summary'
    { name: 'twitter:title', content: () => 'Turing Market' },
    { name: 'twitter:description', content: () => 'Bet on your beliefs!' },
    { name: 'twitter:image', content: () => `${origin}/media/twitter-card.png` },
    { name: 'twitter:url', content: () => `${href}${token.accessToken !== '' ? '?inviteCode=' + userInfo?.inviteCode : ''}` }
  ],
  script: [
    { src: "https://telegram.org/js/telegram-web-app.js", defer: true },
    {
      src: "https://unpkg.com/vconsole@latest/dist/vconsole.min.js",
      defer: true,
    },
  ],
});

const { $fbq } = useNuxtApp()
const { startParams } = $(tgStore());
const { iframeRef } = $(privyStore());
const { locale } = useI18n();
Locale.add({
  "en-US": enUS,
  "zh-TW": zhTW,
  "ja-JP": jaJP,
  "ko-KR": koKR,
});

const initPixel = () => {
  $fbq('track', 'CompleteRegistration')
  $fbq('trackSingle', useRuntimeConfig().public.metapixel.default.id, 'CompleteRegistration')
};

const route = useRoute();
const debug = $(useRouteQuery('debug'))

onMounted(() => {
  Locale.use(locale.value);
  initPixel();

  watchEffect(() => {
    if (debug) {
      localStorage.setItem('debug', debug)
    }
  })

  if (route.query['liff.state']) {
    navigateTo(route.query['liff.state'] as string)
  } else if (startParams?.redirect) {
    navigateTo(startParams.redirect);
  }
})
</script>

<template>
  <div>
    <van-config-provider>
      <NuxtLoadingIndicator />
      <NuxtLayout>
        <NuxtPage />
        <SettingsRightDrawer />
        <LangSwitcherPopup />
        <TradeSettingPopup />
        <OrderSharePopup />
        <AuthLoginModal />
        <BalancePopupV1 />
        <RequestQueueError />
      </NuxtLayout>
    </van-config-provider>
    <iframe ref="iframeRef" />
  </div>
</template>

<style>
:root {
  --nav-height: 110px;
}

.van-floating-bubble {
  overflow: hidden;
  --van-floating-bubble-background: none;
  --van-floating-bubble-icon-size: 40px;
}
</style>
