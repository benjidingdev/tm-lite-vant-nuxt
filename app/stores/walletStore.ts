import { defineStore } from "pinia";
import * as walletApi from "~/api/wallet";
import {
  useConnect,
  useDisconnect,
  useAccount,
  useBalance,
  useSignMessage,
} from "@wagmi/vue";

export const useWalletStore = defineStore("walletStore", () => {
  let walletAddress = $ref("");
  let walletBalance = $ref(0);
  let nonce = $ref("");
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
  const { disconnect } = useDisconnect();

  const setWalletAddress = (address: string) => {
    walletAddress = address;
  };

  const setWalletBalance = (balance: number) => {
    walletBalance = balance;
  };

  /**
   * disconnect wallet
   */
  const disconnectWallet = async () => {
    try {
      await disconnect();
    } catch (err) {
      console.error("Error disconnecting wallet:", err);
    }
  };

  /**
   * get signature message
   */
  const getNonce = async (_address: any) => {
    try {
      let res: any = await walletApi.getNonce({ proxyWallet: _address });
      nonce = res.msg || "error";
      return res;
    } catch (error) {
      //console.log("fetch signature error", error);
      throw error;
    }
  };

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
          state.msg = "signature success";
          todoLogin(data, "wallet");
          store.isToken(false);
        },
        onError: (error, variables, context) => {
          console.log("error", error);
        },
      }
    );
  };

  const todoLogin = async (data, type) => {
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
      // afterLoginSuccess(result);
    }
    //console.log("todoLogin data=", data);
  };

  watch(
    () => address.value,
    (newAddress) => {
      setWalletAddress(newAddress || "");
    },
    { immediate: true }
  )

  return $$({
    walletAddress,
    walletBalance,
    setWalletAddress,
    setWalletBalance,
    getNonce,
    nonce,
    todoSignIn,
    disconnectWallet,
  });
});
