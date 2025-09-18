import { defineStore } from "pinia";
import type { Web3Config } from "~/types";
import {
  type SignTradeDataOptions,
  TYPEHASH_MERGE_SPLIT_ORDER,
  TYPEHASH_ORDER,
  TYPEHASH_PERMIT,
  TYPEHASH_REWARD,
  TYPEHASH_WITHDRAW,
} from "@/config/tradeTypes";
import { approveSign } from "@/api/userInfo";
import { market } from "@/config/abis";
import {
  createWalletClient,
  type WalletClient,
  type CustomTransport,
  publicActions,
  custom,
  erc20Abi,
  formatUnits,
  parseEther,
  parseUnits,
} from "viem";
import type { WalletProvider } from "@linenext/dapp-portal-sdk";

export type Transaction = {
  from: string;
  to: string;
  value: string;
  gas: string;
};

export const lineWalletStore = defineStore(
  "lineWalletStore",
  () => {
    let walletConfig = $ref<Web3Config>();
    let address = $ref<string>();
    let connected = $ref(false);
    let walletProvider = $ref<WalletProvider>();
    let walletClient = $ref<WalletClient<CustomTransport>>();
    let userBalance = $ref(0);
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
      if (!walletProvider) return
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

    const updateWalletConfig = (data: any) => {
      walletConfig = data;
    };

    const updateUserBalance = (balance: number) => {
      userBalance = balance || 0;
      userCapital.total = userBalance + userCapital.position;
    };

    // transaction signature
    const signTradeData = async (options: SignTradeDataOptions) => {
      const { order } = options;
      try {
        const content = {
          domain: getTypedDomain(),
          types: order.hasOwnProperty("side")
            ? TYPEHASH_ORDER
            : TYPEHASH_MERGE_SPLIT_ORDER,
          primaryType: order.hasOwnProperty("side") ? "Order" : "OrderSelf",
          message: order,
        };
        const signature = (await getWalletProvider().request({
          method: "eth_signTypedData_v4",
          params: [address, content],
        })) as string;
        return signature;
      } catch (err) {
        console.error("Error signing typed data:", err);
        throw err;
      }
    };

    // withdraw signature
    const signWithdraw = async (message: any) => {
      try {
        const content = {
          domain: getTypedDomain(),
          types: TYPEHASH_WITHDRAW,
          primaryType: "Withdraw",
          message: message,
        };
        const signature = await getWalletProvider().request({
          method: "eth_signTypedData_v4",
          params: [address, content],
        });
        return signature;
      } catch (err) {
        console.error("Error signing typed data:", err);
        throw err;
      }
    };

    // reward signature
    const signPayout = async (message: any) => {
      try {
        const content = {
          domain: getTypedDomain(),
          types: TYPEHASH_REWARD,
          primaryType: "Reward",
          message: message,
        };
        const result = await getWalletProvider().request({
          method: "eth_signTypedData_v4",
          params: [address, content],
        });
        return result;
      } catch (err) {
        console.error("Error signing typed data:", err);
        throw err;
      }
    };

    // permit signature
    const signPermit = async (coinInfo: any, message: any) => {
      try {
        const content = {
          domain: getTypedDomain(),
          types: TYPEHASH_PERMIT,
          primaryType: "Permit",
          message: message,
        };
        const result = await getWalletProvider().request({
          method: "eth_signTypedData_v4",
          params: [address, content],
        });
        return result;
      } catch (err) {
        console.error("Error signing typed data:", err);
        throw err;
      }
    };

    // get wallet balance and update store
    const updateWalletBalance = async () => {
      if (!address) return;
      if (!walletClient) return;

      // Obtain USDT balance
      let res = await walletClient.readContract({
        address: walletConfig!.main.address,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [address],
      });
      updateUserBalance(Number(formatUnits(res, 6)));
    };

    // Query the user's token authorization
    const queryAllowance = async (coinType: any) => {
      if (!address) return;
      if (!walletClient) return;

      const coinInfo = coinType == 0 ? walletConfig!.main : walletConfig!.meme;
      const result = await walletClient.readContract({
        abi: market,
        address: coinInfo.address,
        args: [address, walletConfig!.contract.address],
        functionName: "allowance",
      });
      return result as bigint;
    };

    const amountPermit = async () => {
      try {
        const allowanceAmount = parseEther("1").toString();
        await queryAllowanceAndPermit(0, allowanceAmount);
        //await queryAllowanceAndPermit(1, allowanceAmount);
      } catch (err) {
        console.error("Error amount permit:", err);
      }
    };

    const queryAllowanceAndPermit = async (
      coinType: any,
      allowanceAmount: string
    ) => {
      if (!address) return;
      if (!walletClient) return;

      try {
        const coinInfo =
          coinType == 0 ? walletConfig!.main : walletConfig!.meme;

        const allowanced = await queryAllowance(coinType);
        if (!allowanced) return;

        const minValue = parseUnits(allowanceAmount, coinType == 0 ? 6 : 18);
        // If the authorization is insufficient, a signature is required
        if (allowanced < minValue) {
          // If the authorization is insufficient, a signature is required
          const nonce = (await walletClient.readContract({
            abi: market,
            address: coinInfo.address,
            args: [address],
            functionName: "nonces",
          })) as bigint;
          // Query nonce first
          const param = {
            owner: address,
            spender: walletConfig!.contract.address,
            value: minValue,
            nonce: nonce,
            deadline: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365 * 100,
          };
          const permitSig = await signPermit(coinInfo, param);
          if (!permitSig) return false;

          // Initiate authorization
          const approveParam = {
            value: formatUnits(param.value, coinType == 0 ? 6 : 18),
            nonce: formatUnits(param.nonce, 0),
            type: coinType,
            sign: permitSig,
            deadline: param.deadline,
            owner: address,
            spender: walletConfig!.contract.address,
          };
          const res = await approveSign(approveParam);
          if (res) return true;
        } else {
          return true; // Authorization is sufficient, no need to sign
        }
      } catch (err) {
        console.error("Error querying allowance and permit:", err);
      }
      return false;
    };

    const getTypedDomain = () => {
      return {
        name: walletConfig?.contract.name,
        version: walletConfig?.contract.version.toString(),
        chainId: getCurrentNetwork().id,
        verifyingContract: walletConfig?.contract.address,
      } as const;
    };

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

      getLineDapp,
      getWalletProvider,
      getPaymentProvider,
      getCurrentNetwork,
      initWalletClient,
      updateWalletConfig,
      updateUserBalance,
      signTradeData,
      signWithdraw,
      signPayout,
      signPermit,
      updateWalletBalance,
      amountPermit,

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
    persist: {
      debug: true,
    },
  }
);

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(lineWalletStore, import.meta.hot));
}
