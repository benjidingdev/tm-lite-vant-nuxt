
<script setup lang="ts">
import { createAppKit } from "@reown/appkit/vue";
import { arbitrum, mainnet, type AppKitNetwork } from "@reown/appkit/networks";
import TabBar from "@/component/TabBar";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";

const projectId = "8d3c4c1f358076d6ccae0076a6fe80c6";
const metadata = {
  name: "AppKit",
  description: "AppKit Example",
  url: "https://example.com", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

const networks: [AppKitNetwork, ...AppKitNetwork[]] = [mainnet];

const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
});

const modal = createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
});

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
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />

      <!--tab bar-->
      <TabBar />
    </NuxtLayout>
  </UApp>
</template>


