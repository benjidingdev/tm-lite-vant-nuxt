import { WagmiPlugin } from "@wagmi/vue";
import { http } from "viem";
import { defineNuxtPlugin } from "nuxt/app";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { networks } from "@/config/networks";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const projectId = config.public.reownProjectId as string;
  const metadata = {
    name: config.public.siteName as string,
    description: config.public.siteDescription as string,
    url: config.public.siteUrl as string, // origin must match your domain & subdomain
    icons: [`${config.public.siteUrl}/favicon.ico`],
  };
  const wagmiAdapter = new WagmiAdapter({
    networks,
    projectId,
  });
  nuxtApp.vueApp.use(WagmiPlugin, {
    config: wagmiAdapter.wagmiConfig,
  });

  return {
    provide: {
      wagmiAdapter,
      wagmiConfig: wagmiAdapter.wagmiConfig,
      metadata,
    },
  };
});
