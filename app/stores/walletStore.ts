import { defineStore } from "pinia";
import * as walletApi from "~/api/wallet";
import {
  // useDisconnect,
  useAccount,
  useSignMessage,
  useSignTypedData,
} from "@wagmi/vue";
import { createWalletClient, http, formatUnits, getAddress } from "viem";
import { avalancheFuji } from "viem/chains";
import { getBalance } from "@wagmi/core";
import type { SignTradeDataOptions } from "@/config/tradeTypes";
import {
  TYPEHASH_DOMAIN,
  TYPEHASH_ORDER,
  TYPEHASH_MERGE_SPLIT_ORDER,
} from "@/config/tradeTypes";
import { createSiweMessage } from "viem/siwe";
import type { SiweMessage } from "@/types";

type contentType = {
  domain: typeof TYPEHASH_DOMAIN;
  types: typeof TYPEHASH_ORDER | typeof TYPEHASH_MERGE_SPLIT_ORDER;
  primaryType: "Order" | "OrderSelf";
  message: any;
};

export const useWalletStore = defineStore("walletStore", () => {
  const { afterLoginSuccess, logOut } = $(authStore());
  const { updateUserBalance, updateTokenBalance, isToken } = $(coreStore());
  // const { createPimlicoClientInstance, smartAccountClient } = $(pimlicoStore());
  let walletConected = $ref<boolean>(false);
  let walletAddress = $ref<string | null>("");
  let msg = $ref("");
  let nonce = $ref("");
  let walletConfig = $ref({});
  let walletClient = $ref(null);
  let isSign = $ref<boolean>(false); // Whether to sign successfully
  let usdtBalance = $ref<bigint | null>(null); // USDT balance
  let tokenBalance = $ref<bigint>(); // TUIT balance

  const { $wagmiAdapter } = useNuxtApp();
  const { isConnected, address, chainId } = $(useAccount());
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

  // refresh sign status
  const updateSign = (sign: boolean) => {
    isSign = sign;
  };

  /**
   * Sign in, after the user connects the wallet, call the backend service to get the message
   * Then request the signature, get the signature string, and call the backend interface to verify the signature
   */
  const signLoginMessage = async (nonce: string) => {
    const messageObj = {
      address: getAddress(address),
      chainId: chainId as number,
      domain: location.host,
      nonce,
      uri: location.href,
      version: "1" as "1",
      issuedAt: new Date(),
      expirationTime: new Date(Date.now() + 60000),
      statement:
        "I accept the TuringM Terms of Service: https://TuringM.io/terms",
    } as SiweMessage;
    const message = createSiweMessage(messageObj);

    try {
      let res = await signMessageAsync(
        {
          account: address,
          message: message,
        },
        {
          onSuccess: (data: any, variables: any, context: any) => {
            isSign = true;
            return data;
          },
          onError: (error: any, variables: any, context: any) => {
            isSign = false;
            isToken(false);
            throw error;
          },
        }
      );
      return { message: messageObj, signature: res };
    } catch (err) {
      console.error("Error signing message:", err);
      isSign = false; // Ensure isSign is false when signing fails
      isToken(false);
      throw err;
    }
  };

  /**
   * Sign in
   * @returns
   */
  const todoSign = async () => {
    if (isSign) return;
    try {
      isSign = true;
      if (address) {
        console.log("todoSign address:", address);
        const nonceRes = await getNonce(address);
        if (nonceRes) {
          const signData = await signLoginMessage(nonceRes.data);
          console.log("signData:", signData);
          await todoLogin(signData);
        }
      }
    } catch (error) {
      console.log("todoSign error", error);
    } finally {
      isSign = false;
    }
  };

  // transcation signature
  const signTradeData = async (options: SignTradeDataOptions) => {
    const { domain, types, order } = options;
    try {
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

  // get signature message
  const getNonce = async (_address: any) => {
    try {
      let res: any = await walletApi.getNonce({ proxyWallet: _address });
      return res;
    } catch (error) {
      throw error;
    }
  };

  // start login process
  const todoLogin = async (data: {
    message: SiweMessage;
    signature: string;
  }) => {
    let inviteCode = localStorage.getItem("inviteCode") || "";
    let result = await walletApi.loginByWallet({
      proxyWallet: address,
      ivcode: inviteCode,
      signature: data.signature,
      message: data.message,
    });
    if (result && result?.code === 0) {
      console.log("login success");
      afterLoginSuccess(result);
      // Update wallet balance
      updateWalletBalance();
    }
  };

  // /**
  //  * get wallet balance and update store
  //  */
  const updateWalletBalance = async () => {
    console.log("params", {
      chainId: chainId,
      address: address as any,
      token: walletConfig.main.address,
    });
    if (!address) return;
    // get USDT balance
    getBalance($wagmiAdapter.wagmiConfig, {
      chainId: chainId,
      address: address as any,
      token: walletConfig!.main.address,
    }).then((res) => {
      if (res.value != usdtBalance) {
        updateUserBalance(Number(formatUnits(res.value, res.decimals)));
        usdtBalance = res.value;
      }
    });
    // get MEME balance
    getBalance($wagmiAdapter.wagmiConfig, {
      chainId: chainId,
      address: address as any,
      token: walletConfig!.meme.address,
    }).then((res) => {
      if (res.value != tokenBalance) {
        console.log(`token balance change: ${tokenBalance} → ${res.value}`);
        updateTokenBalance(Number(formatUnits(res.value, res.decimals)));
        tokenBalance = res.value;
      }
    });
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
        initWalletClient();
        // await createPimlicoClientInstance();
        todoSign();
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
    todoSign,
    signTradeData,
    updateSign,
    setWalletAddress,
    updateWalletConfig,
    walletClient,
  });
});
