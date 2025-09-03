<script setup lang="ts">
  // import { createAppKit } from "@reown/appkit/vue";
  // import { networks, localHardhat, avaxTest } from "./config/networks";
  import "@vant/touch-emulator";
  import { Locale } from 'vant'
  import enUS from 'vant/es/locale/lang/en-US'
  import zhTW from 'vant/es/locale/lang/zh-TW'
  import jaJP from 'vant/es/locale/lang/ja-JP'
  import koKR from 'vant/es/locale/lang/ko-KR'
  const { locale } = useI18n()
  Locale.add({
    'en-US': enUS,
    'zh-TW': zhTW,
    'ja-JP': jaJP,
    'ko-KR': koKR,
  });
  onMounted(() => {
    Locale.use(locale.value)
  })

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
      { src: "https://telegram.org/js/telegram-web-app.js" },
      { src: "https://unpkg.com/vconsole@latest/dist/vconsole.min.js" },
    ],
  });

  const { setupEmbeddedWalletIframe, refreshSession } = $(privyStore());
  const iframeRef = ref<HTMLIFrameElement | null>(null);
  let cleanupIframe: (() => void) | null = null;

  onMounted(() => {
    refreshSession();

    if (iframeRef.value) {
      cleanupIframe = setupEmbeddedWalletIframe(iframeRef.value);
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
