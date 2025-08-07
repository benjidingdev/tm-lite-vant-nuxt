import { defineStore } from "pinia";
import * as walletApi from "~/api/wallet";
import {
  // useDisconnect,
  useAccount,
  useSignMessage,
  useSignTypedData,
} from "@wagmi/vue";
import { createWalletClient, http } from "viem";
import type { SignTradeDataOptions } from "@/config/tradeTypes";
import {
  TYPEHASH_DOMAIN,
  TYPEHASH_ORDER,
  TYPEHASH_MERGE_SPLIT_ORDER,
} from "@/config/tradeTypes";
import { avalancheFuji } from "viem/chains";

type contentType = {
  domain: typeof TYPEHASH_DOMAIN;
  types: typeof TYPEHASH_ORDER | typeof TYPEHASH_MERGE_SPLIT_ORDER;
  primaryType: "Order" | "OrderSelf";
  message: any;
};

export const useWalletStore = defineStore("walletStore", () => {
  const { afterLoginSuccess, logOut } = $(authStore());
  // const { createPimlicoClientInstance, smartAccountClient } = $(pimlicoStore());
  let walletConected = $ref<boolean>(false);
  let walletAddress = $ref<string | null>("");
  let isSign = $ref<boolean>(false);
  let msg = $ref("");
  let nonce = $ref("");
  let walletConfig = $ref({});
  let walletClient = $ref(null);
  const { isConnected, address } = $(useAccount());
  const { signMessageAsync } = useSignMessage();
  const { signTypedDataAsync } = useSignTypedData();

  const initWalletClient = () => {
    walletClient = createWalletClient({
      account: walletAddress,
      transport: http(avalancheFuji.rpcUrls.default.http[0]),
    });
  };

  const setWalletAddress = (address: string) => {
    walletAddress = address;
  };

  const setWalletConnected = (connected: boolean) => {
    walletConected = connected;
  };

  const updateWalletConfig = (data: any) => {
    walletConfig = data;
  };

  /**
   * refresh sign status
   */
  const updateSign = (sign: boolean) => {
    isSign.value = sign;
  };

  /**
   *  request signature
   */
  const todoSignIn = async () => {
    let nonce = new Date().getTime().toString();
    let message = "Welcome to TuringMarket Sign to connect.";
    message = message.concat("\nNonce:\n").concat(nonce);
    message = message.concat("\nNonce:\n").concat(nonce);

    let res = await getNonce(address);
    if (res && res.code === 0) {
      message = res.data;
    } else {
      return;
    }

    await signMessageAsync(
      { account: address, message: message },
      {
        onSuccess: (data, variables, context) => {
          msg = "signature success";
          todoLogin(data, "wallet");
        },
        onError: (error, variables, context) => {
          console.log("error", error);
        },
      }
    );
  };

  /**
   *  transcation signature
   */
  const signTradeData = async (options: SignTradeDataOptions) => {
    const { domain, types, order } = options;
    try {
      // signature head information
      const typeDomain = {
        name: walletConfig.contract.name,
        version: walletConfig.contract.version.toString(),
        chainId: walletConfig.chain.id,
        verifyingContract: walletConfig.contract.address,
      } as const;
      // signature trade data
      const content: contentType = {
        domain: typeDomain,
        types: order.hasOwnProperty("side")
          ? TYPEHASH_ORDER
          : TYPEHASH_MERGE_SPLIT_ORDER,
        primaryType: order.hasOwnProperty("side") ? "Order" : "OrderSelf",
        message: order,
      };
      // signature returned result
      const result = await signTypedDataAsync(content);
      console.log("result:", result);

      return result;
    } catch (err) {
      console.error("Error signing typed data:", err);
      throw err;
    }
  };

  /**
   * get signature message
   */
  const getNonce = async (_address: any) => {
    try {
      let res: any = await walletApi.getNonce({ proxyWallet: _address });
      return res;
    } catch (error) {
      throw error;
    }
  };

  const todoLogin = async (data: any, type: any) => {
    let result = await walletApi.loginByWallet({
      proxyWallet: address,
      signature: data,
    });
    if (result && result.code === 0) {
      console.log("login success");
      afterLoginSuccess(result);
    }
  };

  watch(
    () => address,
    async (newAddress) => {
      setWalletAddress(newAddress || "");
    },
    { immediate: true }
  );

  watch(
    () => isConnected,
    async (isConnected: boolean) => {
      setWalletConnected(isConnected);
      if (isConnected) {
        setTimeout(async () => {
          initWalletClient();
          // await createPimlicoClientInstance();
          todoSignIn();
        }, 1000);
      } else {
        logOut();
      }
    },
    { immediate: true }
  );

  return $$({
    walletAddress,
    walletConected,
    walletConfig,
    nonce,
    msg,
    getNonce,
    todoSignIn,
    signTradeData,
    // disconnectWallet,
    updateSign,
    setWalletAddress,
    updateWalletConfig,
    walletClient,
  });
});
