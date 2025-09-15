import { defineStore } from "pinia";
import {
  initializeKaiaSDK,
  getCurrentKaiaNetwork,
  isKaiaEnabled,
  getKaiaSDK,
} from "~/config/kaia";

export const useKaiaStore = defineStore("kaia", () => {
  let isInitialized = $ref(false);
  let isConnected = $ref(false);
  let account = $ref<string | null>(null);
  let chainId = $ref<string | null>(null);
  let balance = $ref<string | null>(null);
  let isLoading = $ref(false);

  let sdk =  $computed(() => getKaiaSDK());

  const isEnabled = $computed(() => isKaiaEnabled.value);
  const currentNetwork = $computed(() => getCurrentKaiaNetwork());
  const walletProvider = $computed(() => sdk?.getWalletProvider());
  const paymentProvider = $computed(() => sdk?.getPaymentProvider());

  // Initialize SDK
  const initialize = async () => {
    if (!isEnabled) {
      console.log("Kaia SDK is disabled");
      return false;
    }

    try {
      isLoading = true;

      const kaiaSDK = await initializeKaiaSDK();
      if (!kaiaSDK) {
        throw new Error("Failed to initialize Kaia SDK");
      }

      isInitialized = true;
      chainId = getCurrentKaiaNetwork().chainId;

      console.log("Kaia store initialized successfully");
      return true;
    } catch (err) {
      console.error("Kaia store initialization error:", err);
      return false;
    } finally {
      isLoading = false;
    }
  };

  // Connect to the wallet
  const connect = async () => {
    if (!isInitialized || !walletProvider) {
      throw new Error(
        "Kaia SDK not initialized or wallet provider not available"
      );
    }

    try {
      isLoading = true;

      const provider = walletProvider;
      if (!provider) {
        throw new Error("Wallet provider not available");
      }

      // Connecting wallet logic
      const accounts = (await provider.request({
        method: "eth_requestAccounts",
      })) as string[];

      if (accounts && accounts.length > 0) {
        account = accounts[0] || null;
        isConnected = true;

        // Get balance
        await updateBalance();
      }

      return account;
    } catch (err) {
      console.error("Kaia wallet connection error:", err);
      throw err;
    } finally {
      isLoading = false;
    }
  };

  // Disconnect
  const disconnect = async () => {
    isConnected = false;
    account = null;
    balance = null;
  };

  // Update balance
  const updateBalance = async () => {
    const provider = walletProvider;
    if (!account || !provider) return;

    try {
      const balanceResult = (await provider.request({
        method: "eth_getBalance",
        params: [account, "latest"],
      })) as string;

      // Convert wei to KAIA
      balance = (parseInt(balanceResult, 16) / Math.pow(10, 18)).toFixed(
        4
      );
    } catch (err) {
      console.error("Failed to update balance:", err);
    }
  };

  // Switch network
  const switchNetwork = async (targetChainId: string) => {
    const provider = walletProvider;
    if (!provider) {
      throw new Error("Wallet provider not available");
    }

    try {
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${parseInt(targetChainId).toString(16)}` }],
      });

      chainId = targetChainId;
    } catch (err) {
      console.error("Failed to switch network:", err);
      throw err;
    }
  };

  return {
    // state
    isInitialized: readonly(isInitialized),
    isConnected: readonly(isConnected),
    account,
    chainId,
    balance,
    isLoading,
    sdk,

    isEnabled,
    currentNetwork,
    walletProvider,
    paymentProvider,

    initialize,
    connect,
    disconnect,
    updateBalance,
    switchNetwork,
  };
});
