import { getAddress } from "viem";
import { useDisconnect } from "@wagmi/vue";
import { createSiweMessage } from "viem/siwe";
import type { SiweMessage } from "@/types";
import { getUserProfile } from "@/api/userInfo";
import { getLogout } from "~/api/login";
import * as walletApi from "~/api/wallet";

export const authStore = defineStore("authStore", () => {
  const { updateUserInfo, updateTraderType, isToken } = $(coreStore());
  const { setLoadingToast } = $(uiStore());
  const { loadUserInfo, userInfo } = $(userStore());
  const { updateWalletBalance, wallet, walletClient } = $(walletStore());

  const { disconnect } = useDisconnect();
  let token = $ref({
    accessToken: "",
    expiresTime: "",
    openid: "",
    refreshToken: "",
    userId: "",
  });
  let isSign = $ref<boolean>(false); // Whether to sign successfully

  // refresh local cache token
  const updateToken = (tokenInfo: any) => {
    if (JSON.stringify(tokenInfo) === "{}") {
      Object.keys(token).forEach((key) => (token[key] = ""));
    } else {
      token = tokenInfo;
    }
  };

  // refresh user login status after login successfully
  const afterLoginSuccess = async (data: any) => {
    updateToken(data.data);
    await loadUserInfo();
    let userProfile = await getUserProfile({
      proxyWallet: userInfo.proxyWallet,
    });
    updateTraderType(userProfile.data.traderType);
  };

  // disconnect wallet and log out
  const logOut = async () => {
    try {
      let res: any = await getLogout();
      if (res?.code === 0) {
        updateToken({});
        disconnect();
        updateUserInfo({});
        showToast("Logout successful");
      }
    } catch (e) {
      console.log("Failure message：", e);
    }
  };

  /**
   * Sign in, after the user connects the wallet, call the backend service to get the message
   * Then request the signature, get the signature string, and call the backend interface to verify the signature
   */
  const signLoginMessage = async (nonce: string) => {
    const address = wallet?.address;
    const chainId = walletClient.chain?.id;
    const messageObj = {
      address: getAddress(address),
      chainId: chainId as number,
      domain: location.host,
      nonce,
      uri: location.origin,
      version: "1" as "1",
      issuedAt: new Date(),
      expirationTime: new Date(Date.now() + 60000),
      statement:
        "I accept the TuringM Terms of Service: https://TuringM.io/terms",
    } as SiweMessage;
    const message = createSiweMessage(messageObj);

    try {
      let res = await walletClient.signMessage({
        account: address,
        message: message,
      });
      return { message: messageObj, signature: res };
    } catch (err) {
      isSign = false; // Ensure isSign is false when signing fails
      isToken(false);
      throw err;
    } finally {
      closeToast();
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

  /**
   * Sign in
   * @returns
   */
  const todoSign = async () => {
    setLoadingToast("Start to sign");
    if (isSign) return;
    try {
      isSign = true;
      const address = wallet?.address;
      if (address) {
        console.log("todoSign address:", address);
        const nonceRes = await getNonce(address);
        if (nonceRes) {
          const signData = await signLoginMessage(nonceRes.data);
          await todoLogin(signData);
        }
      }
    } catch (error) {
      console.log("todoSign error", error);
    } finally {
      isSign = false;
      closeToast();
    }
  };

  // start login process
  const todoLogin = async (data: {
    message: SiweMessage;
    signature: string;
  }) => {
    setLoadingToast("Start to login");
    const address = wallet?.address;
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
    } else {
      console.error("Login failed:");
    }
    closeToast();
  };

  // refresh sign status
  const updateSign = (sign: boolean) => {
    isSign = sign;
  };

  return $$({
    token,
    afterLoginSuccess,
    logOut,
    todoSign,
    updateToken,
    updateSign,
    getNonce,
  });
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(authStore, import.meta.hot));
}
