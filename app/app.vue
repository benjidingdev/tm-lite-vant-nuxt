<script setup lang="ts">
import "@vant/touch-emulator";
import { Locale } from 'vant'
import enUS from 'vant/es/locale/lang/en-US'
import zhTW from 'vant/es/locale/lang/zh-TW'
import jaJP from 'vant/es/locale/lang/ja-JP'
import koKR from 'vant/es/locale/lang/ko-KR'

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
    // { src: "https://telegram.org/js/telegram-web-app.js" },
    // { src: "https://unpkg.com/vconsole@latest/dist/vconsole.min.js" },
  ],
});

const { setupEmbeddedWalletIframe, refreshSession } = $(privyStore());
const iframeRef = ref<HTMLIFrameElement | null>(null);
let cleanupIframe: (() => void) | null = null;

const { locale } = useI18n()
Locale.add({
  'en-US': enUS,
  'zh-TW': zhTW,
  'ja-JP': jaJP,
  'ko-KR': koKR,
});

let { startParam } = $(shareStore());
onMounted(async () => {
  Locale.use(locale.value)
  refreshSession();

  if (iframeRef.value) {
    cleanupIframe = setupEmbeddedWalletIframe(iframeRef.value);
  }

  const { code, redirect } = getFatherInviteCode();
  if (code) {
    startParam.code = code;
  }

  if (redirect) {
    startParam.redirect = redirect;
    console.log({ redirect });
    await navigateTo(redirect);
  }
});

onUnmounted(() => {
  if (cleanupIframe) {
    cleanupIframe();
    cleanupIframe = null;
  }
});
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
          <SettingsNumberKeyBoard />
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
