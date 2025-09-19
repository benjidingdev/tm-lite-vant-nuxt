import { defineStore } from "pinia";
import {
  createWalletClient,
  type WalletClient,
  type CustomTransport,
  publicActions,
  custom,
} from "viem";
import type { WalletProvider } from "@linenext/dapp-portal-sdk";

export type Transaction = {
  from: string;
  to: string;
  value: string;
  gas: string;
};

export const lineStore = defineStore(
  "lineStore",
  () => {
    const isEnable = useRuntimeConfig().public.kaia?.enabled === true;

    let address = $ref<string>();
    let connected = $ref(false);
    let walletProvider = $ref<WalletProvider>();
    let walletClient = $ref<WalletClient<CustomTransport>>();
    let userBalance = $ref(null);
    let userCapital = $ref({
      total: 0,
      balance: 0,
      freez: 0,
      frozen: 0,
      position: 0,
    });

    const getLineDapp = () => {
      const lineDapp = useNuxtApp().$lineSDK();
      if (!lineDapp) throw new Error("Line sdk not available");
      return lineDapp;
    };

    const getWalletProvider = () => {
      if (!walletProvider) {
        walletProvider = useNuxtApp().$lineWalletProvider();
        if (!walletProvider) throw new Error("Wallet provider not available");
      }
      return walletProvider;
    };

    const getPaymentProvider = () => {
      const paymentProvider = useNuxtApp().$linePaymentProvider();
      if (!paymentProvider) throw new Error("Payment provider not available");
      return paymentProvider;
    };

    const getCurrentNetwork = () => {
      const network = useNuxtApp().$lineCurrentNetwork();
      if (!network) throw new Error("Line network not define");
      return network;
    };

    const initWalletClient = () => {
      if (!walletProvider) return;
      walletProvider
        .request({
          method: "kaia_accounts",
        })
        .then((accounts: string[] | unknown) => {
          if (Array.isArray(accounts)) {
            address = accounts[0];
            const signer = {
              getAddresses: () => accounts,
              request: (args: { method: string; params: any[] }) =>
                walletProvider!.request(args),
            };
            walletClient = createWalletClient({
              chain: getCurrentNetwork(),
              transport: custom({
                async request({ method, params }) {
                  return await signer.request({ method, params });
                },
              }),
            }).extend(publicActions);
          }
        });
    };
    initWalletClient();

    // --- account ---
    const getAccount = async () => {
      const walletProvider = getWalletProvider();
      const accounts = (await walletProvider.request({
        method: "kaia_accounts",
      })) as string[];
      return accounts?.[0] || null;
    };

    const requestAccount = async () => {
      const walletProvider = getWalletProvider();
      const accounts = (await walletProvider.request({
        method: "kaia_requestAccounts",
      })) as string[];
      if (accounts?.[0]) {
        connected = true;
        address = accounts?.[0];
        initWalletClient();

        return accounts?.[0] || null;
      }
    };

    // --- connect and sign ---
    const connectAndSign = async (msg: string) => {
      const walletProvider = getWalletProvider();
      const [account, signature] = (await walletProvider.request({
        method: "kaia_connectAndSign",
        params: [msg],
      })) as string[];
      if (account) {
        connected = true;
        initWalletClient();
      }
      return [account, signature];
    };

    // --- balance ---
    const getBalance = async (params: [string, "latest" | "earliest"]) => {
      const walletProvider = getWalletProvider();
      return await walletProvider.request({
        method: "kaia_getBalance",
        params,
      });
    };

    const updateBalance = async (account: string) => {
      const walletProvider = getWalletProvider();
      const balanceHex = (await walletProvider.request({
        method: "kaia_getBalance",
        params: [account, "latest"],
      })) as string;
      return (parseInt(balanceHex, 16) / Math.pow(10, 18)).toFixed(4);
    };

    // --- send transaction ---
    const sendTransaction = async (transaction: Transaction) => {
      const walletProvider = getWalletProvider();
      return await walletProvider.request({
        method: "kaia_sendTransaction",
        params: [transaction],
      });
    };

    const getErc20TokenBalance = async (
      contractAddress: string,
      account: string
    ) => {
      const walletProvider = getWalletProvider();
      return await walletProvider.getErc20TokenBalance(
        contractAddress,
        account
      );
    };

    // --- disconnect wallet ---
    const disconnect = async () => {
      try {
        if (!walletProvider) return;
        await walletProvider.disconnectWallet();
        connected = false;
        address = undefined;
        walletProvider = undefined;
        walletClient = undefined;
      } catch (error) {
        console.error("Failed to disconnect wallet:", error);
      }
    };

    return $$({
      address,
      userBalance,
      userCapital,
      walletClient,
      isEnable,
      getLineDapp,
      getWalletProvider,
      getPaymentProvider,
      getCurrentNetwork,
      initWalletClient,
      getAccount,
      requestAccount,
      connectAndSign,
      getBalance,
      updateBalance,
      sendTransaction,
      getErc20TokenBalance,
      disconnect,
    });
  },
  {
    // @ts-ignore
    persist: {
      debug: true,
    },
  }
);

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(lineStore, import.meta.hot));
}
