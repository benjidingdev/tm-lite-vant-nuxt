<script setup lang="ts">
import { createAppKit, useAppKitTheme } from "@reown/appkit/vue";
import { networks, localHardhat, avaxTest } from "./config/networks";
import "@vant/touch-emulator";

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

const config = useRuntimeConfig();
const { $wagmiAdapter, $metadata } = useNuxtApp();
createAppKit({
  adapters: [$wagmiAdapter],
  networks: [localHardhat, avaxTest],
  projectId: config.public.reownProjectId,
  features: {
    email: false,
    socials: [],
    analytics: true,
    legalCheckbox: true,
    session: {
      persist: true,
      storage: "localStorage",
      timeout: 604800,
    },
  },
  themeMode: "light",
  defaultAccountTypes: { eip155: "eoa" },
  metadata: $metadata,
  debug: true,
  themeVariables: {
    "--w3m-color-mixin": "#000000",
  },
  // termsConditionsUrl: "https://TuringM.io/terms",
  // privacyPolicyUrl: "https://TuringM.io/privacy",
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
      </NuxtLayout>
    </div>
  </van-config-provider>
  <iframe ref="iframeRef" />
</template>
