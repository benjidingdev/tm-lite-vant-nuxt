<script setup lang="ts">
  import { createAppKit, useAppKitTheme } from "@reown/appkit/vue";
  import { networks, localHardhat, avaxTest } from "./config/networks";
  import { userConfig } from "~/api/userInfo";

  useHead({
    title: "turning Market",
    meta: [
      {
        name: "viewport",
        content:
          "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
      },
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
</script>

<template>
  <van-config-provider>
    <div>
      <NuxtLoadingIndicator />
      <NuxtLayout>
        <NuxtPage />
        <LangSwitcherPopup />
      </NuxtLayout>
    </div>
  </van-config-provider>
</template>
