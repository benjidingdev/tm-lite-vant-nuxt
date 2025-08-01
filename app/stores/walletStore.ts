import { defineStore } from "pinia";
import * as walletApi from "~/api/wallet";
import {
  useConnect,
  // useDisconnect,
  useAccount,
  useSignMessage,
  useSignTypedData,
  useAccountEffect,
} from "@wagmi/vue";
import { mainnet } from "@wagmi/vue/chains";
import type { SignTradeDataOptions } from "@/config/tradeTypes";
import {
  TYPEHASH_DOMAIN,
  TYPEHASH_ORDER,
  TYPEHASH_MERGE_SPLIT_ORDER,
  TYPEHASH_PERMIT,
  TYPEHASH_REWARD,
  TYPEHASH_BROKER,
} from "@/config/tradeTypes";

type contentType = {
  domain: typeof TYPEHASH_DOMAIN;
  types: typeof TYPEHASH_ORDER | typeof TYPEHASH_MERGE_SPLIT_ORDER;
  primaryType: "Order" | "OrderSelf";
  message: any;
};

export const useWalletStore = defineStore("walletStore", () => {
  const { afterLoginSuccess } = $(authStore());
  let walletConected = $ref<boolean>(false);
  let walletAddress = $ref<string | null>("");
  let isSign = $ref<boolean>(false);
  let msg = $ref("");
  let nonce = $ref("");
  let walletConfig = $ref({});
  const {
    isConnected,
    address,
    connector,
    chain,
    chainId,
    status,
    isDisconnected,
  } = useAccount();
  const { data: signedMessage, signMessageAsync } = useSignMessage();
  const { signTypedDataAsync } = useSignTypedData();

  const setWalletAddress = (address: string) => {
    walletAddress = address;
  };

  const setWalletConnected = (connected: boolean) => {
    walletConected = connected;
  };
  // /**
  //  * disconnect wallet
  //  */
  // const disconnectWallet = async () => {
  //   try {
  //     await disconnect();
  //   } catch (err) {
  //     console.error("Error disconnecting wallet:", err);
  //   }
  // };

  /**request signature
   *  */
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
      { account: address.value, message: message },
      {
        onSuccess: (data, variables, context) => {
          msg = "signature success";
          todoLogin(data, "wallet");
          // store.isToken(false);
        },
        onError: (error, variables, context) => {
          console.log("error", error);
        },
      }
    );
  };

  /**
   * transcation signature
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
      // //console.log('content:', content, 'result:', result)

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
      let res: any = await walletApi.getNonce({ proxyWallet: _address.value });
      return res;
    } catch (error) {
      throw error;
    }
  };

  const todoLogin = async (data: any, type: any) => {
    console.log("todoLogin address=", {
      proxyWallet: address.value,
      signature: data,
    });
    let result = await walletApi.loginByWallet({
      proxyWallet: address.value,
      signature: data,
    });
    if (result && result.code === 0) {
      console.log("login success");
      afterLoginSuccess(result);
    }
    //console.log("todoLogin data=", data);
  };

  /**
   *
   * refresh user info after login
   */
  const loadUserInfo = async () => {
    // if (store.token.accessToken) {
    //   //getUserInfo
    //   let user = await getUserInfo();
    //   //user.data.experience: 0
    //   store.codeShow = user.data.experience === 0 ? true : false;
    //   store.updateUserInfo(user.data);
    //   //get wallet balance
    //   let money = await getUserPortfolio();
    //   store.updateUserMoney(money.data.portfolio);
    // }
  };

  /**
   *
   * refresh sign status
   */
  const updateSign = (sign: boolean) => {
    isSign.value = sign;
  };

  watch(
    () => address.value,
    (newAddress) => {
      setWalletAddress(newAddress || "");
      todoSignIn();
    },
    { immediate: true }
  );

  watch(
    () => isConnected.value,
    (isConnected: boolean) => {
      setWalletConnected(isConnected);
    },
    { immediate: true }
  );

  return $$({
    walletAddress,
    walletConected,
    setWalletAddress,
    getNonce,
    nonce,
    msg,
    todoSignIn,
    signTradeData,
    // disconnectWallet,
    updateSign,
  });
});
