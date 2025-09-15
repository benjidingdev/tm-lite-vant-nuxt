import { defineStore } from "pinia";
import { initializeKaiaSDK, getKaiaSDK, isKaiaEnabled } from "~/config/kaia";
import { liff } from "~/utils/liff";

export type Transaction = {
  from: string;
  to: string;
  value: string;
  gas: string;
};

export const useKaiaWalletStore = defineStore("kaiaWallet", () => {
  const sdk = ref<ReturnType<typeof getKaiaSDK> | null>(null);

  const walletProvider = computed(() => sdk.value?.getWalletProvider());
  const paymentProvider = computed(() => sdk.value?.getPaymentProvider());
  const isEnabled = computed(() => isKaiaEnabled.value && !!sdk.value);

  // --- initialize SDK ---
  const initialize = async () => {
    try {
      const config = useRuntimeConfig();
      const liffId = config.public?.liffId as string;

      if (liffId) {
        await liff.init({ liffId });
      }

      const kaiaSDK = await initializeKaiaSDK();
      sdk.value = kaiaSDK;

      return kaiaSDK;
    } catch (error) {
      console.error("Failed to initialize Kaia Wallet SDK:", error);
      return null;
    }
  };

  // --- account ---
  const getAccount = async () => {
    if (!walletProvider.value) throw new Error("Wallet provider not available");
    const accounts = (await walletProvider.value.request({
      method: "kaia_accounts",
    })) as string[];
    return accounts?.[0] || null;
  };

  const requestAccount = async () => {
    if (!walletProvider.value) throw new Error("Wallet provider not available");
    const accounts = (await walletProvider.value.request({
      method: "kaia_requestAccounts",
    })) as string[];
    return accounts?.[0] || null;
  };

  // --- connect and sign ---
  const connectAndSign = async (msg: string) => {
    if (!walletProvider.value) throw new Error("Wallet provider not available");
    const [account, signature] = (await walletProvider.value.request({
      method: "kaia_connectAndSign",
      params: [msg],
    })) as string[];
    return [account, signature];
  };

  // --- balance ---
  const getBalance = async (params: [string, "latest" | "earliest"]) => {
    if (!walletProvider.value) throw new Error("Wallet provider not available");
    return await walletProvider.value.request({
      method: "kaia_getBalance",
      params,
    });
  };

  const updateBalance = async (account: string) => {
    if (!walletProvider.value) throw new Error("Wallet provider not available");
    const balanceHex = (await walletProvider.value.request({
      method: "eth_getBalance",
      params: [account, "latest"],
    })) as string;
    return (parseInt(balanceHex, 16) / Math.pow(10, 18)).toFixed(4);
  };

  // --- send transaction ---
  const sendTransaction = async (transaction: Transaction) => {
    if (!walletProvider.value) throw new Error("Wallet provider not available");
    return await walletProvider.value.request({
      method: "kaia_sendTransaction",
      params: [transaction],
    });
  };

  const getErc20TokenBalance = async (contractAddress: string, account: string) => {
    if (!walletProvider.value) throw new Error("Wallet provider not available");
    return await walletProvider.value.getErc20TokenBalance(contractAddress, account);
  };

  // --- disconnect wallet ---
  const disconnect = async () => {
    try {
      await walletProvider.value?.disconnectWallet();
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
    } finally {
      sdk.value = null;
    }
  };

  return {
    // state
    sdk,
    walletProvider,
    paymentProvider,
    isEnabled,

    // methods
    initialize,
    getAccount,
    requestAccount,
    connectAndSign,
    getBalance,
    updateBalance,
    sendTransaction,
    getErc20TokenBalance,
    disconnect,
  };
});
