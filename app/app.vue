<script setup lang="ts">
import "@vant/touch-emulator";
import { Locale } from "vant";
import enUS from "vant/es/locale/lang/en-US";
import zhTW from "vant/es/locale/lang/zh-TW";
import jaJP from "vant/es/locale/lang/ja-JP";
import koKR from "vant/es/locale/lang/ko-KR";
import { useRouteQuery } from '@vueuse/router'

useHead({
  title: "Turing Market",
  meta: [
    {
      name: "viewport",
      content:
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, viewport-fit=cover",
    },
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

const { iframeRef } = $(privyStore());
const { locale } = useI18n();
Locale.add({
  "en-US": enUS,
  "zh-TW": zhTW,
  "ja-JP": jaJP,
  "ko-KR": koKR,
});

const initPixel = () => {
  console.log('init pixel', useRuntimeConfig().public.metapixel.default.id)
  $fbq('track', 'CompleteRegistration')
  $fbq('trackSingle', useRuntimeConfig().public.metapixel.default.id, 'CompleteRegistration')
};

let { startParam } = $(shareStore());
onMounted(async () => {
  Locale.use(locale.value);

  initPixel();
  startParam = getFatherInviteCode() as any;
  if (startParam.redirect) {
    await navigateTo(startParam.redirect);
  }
});

const debug = $(useRouteQuery('debug'))
onMounted(() => {
  watchEffect(() => {
    if (debug) {
      localStorage.setItem('debug', debug)
    }
  })
})
</script>

<template>
  <ClientOnly>
    <van-config-provider>
      <div>
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
      </div>
    </van-config-provider>
  </ClientOnly>
  <iframe ref="iframeRef" />
</template>

<style>
:root {
  --nav-height: 110px;
}
</style>
