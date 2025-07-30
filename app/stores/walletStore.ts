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
  const { afterLoginSuccess } = $(useAuthStore());
  let walletAddress = $ref("");
  let walletBalance = $ref(0);
  let walletConected = $ref(false);
  let isSign = $ref(false);
  let msg = $ref("");
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

  const setWalletConnected = (connected: boolean) => {
    walletConected = connected;
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
   * get signature message
   */
  const getNonce = async (_address: any) => {
    try {
      let res: any = await walletApi.getNonce({ proxyWallet: _address.value });
      return res;
    } catch (error) {
      //console.log("fetch signature error", error);
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
    walletBalance,
    walletConected,
    setWalletAddress,
    setWalletBalance,
    getNonce,
    nonce,
    msg,
    todoSignIn,
    disconnectWallet,
    updateSign,
  });
});
