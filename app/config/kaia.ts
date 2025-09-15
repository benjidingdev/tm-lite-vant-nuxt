import DappPortalSDK from "@linenext/dapp-portal-sdk";
import type { DappPortalSDKClientConfig } from "@linenext/dapp-portal-sdk";

// Kaia Network configurations
export const KAIA_NETWORKS = {
  mainnet: {
    chainId: "8217",
    name: "Kaia Mainnet",
    currency: "KAIA",
    explorerUrl: "https://kaiascan.io",
    rpcUrl: "https://public-en.node.kaia.io",
  },
  testnet: {
    chainId: "1001",
    name: "Kaia Kairos Testnet",
    currency: "KAIA",
    explorerUrl: "https://kairos.kaiascan.io",
    rpcUrl: "https://public-en-kairos.node.kaia.io",
  },
} as const;

// Singleton variables
let kaiaSDK: DappPortalSDK | null = null;
let isInitializing = false;

export const getKaiaSDK = (): DappPortalSDK | null => {
  return kaiaSDK;
};

export const initializeKaiaSDK = async (): Promise<DappPortalSDK | null> => {
  if (kaiaSDK || isInitializing) return kaiaSDK;

  isInitializing = true;

  try {
    const config = useRuntimeConfig();
    const clientId = config.public.kaia?.clientId as string;
    const chainId = config.public.kaia?.chainId as string;

    if (!clientId) {
      console.warn("Kaia SDK: clientId not configured");
      return null;
    }

    const sdkConfig: DappPortalSDKClientConfig = {
      clientId,
      chainId: chainId || "1001",
    };
    kaiaSDK = await DappPortalSDK.init(sdkConfig);
    // debugger

    return kaiaSDK;
  } catch (error) {
    console.error("Failed to initialize Kaia SDK:", error);
    return null;
  } finally {
    isInitializing = false;
  }
};

export const getInitializedKaiaSDK = (): DappPortalSDK | null => {
  return kaiaSDK;
};

export const isKaiaEnabled = computed(() => {
  const config = useRuntimeConfig();
  return config.public.kaia?.enabled === true;
});

export const isSupportedBrowser = computed(() => {
  const sdk = getKaiaSDK();
  return sdk?.isSupportedBrowser() ?? false;
});

export async function showUnsupportedBrowserGuide(): Promise<void> {
  const sdk = getKaiaSDK();
  if (sdk) {
    await sdk.showUnsupportedBrowserGuide();
  }
}

export function getKaiaWalletProvider() {
  const sdk = getKaiaSDK();
  return sdk?.getWalletProvider();
}

export function getKaiaPaymentProvider() {
  const sdk = getKaiaSDK();
  return sdk?.getPaymentProvider();
}

export function getCurrentKaiaNetwork() {
  const config = useRuntimeConfig();
  const chainId = config.public.kaia?.chainId as string;

  if (chainId === "8217") {
    return KAIA_NETWORKS.mainnet;
  } else {
    return KAIA_NETWORKS.testnet;
  }
}
