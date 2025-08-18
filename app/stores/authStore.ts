import { getAddress } from "viem";
import { useDisconnect, useAccount, useSignMessage } from "@wagmi/vue";
import { createSiweMessage } from "viem/siwe";
import type { SiweMessage } from "@/types";
import { getUserInfo, getUserProfile } from "@/api/userInfo";
import { getLogout } from "~/api/login";
import * as walletApi from "~/api/wallet";

export const authStore = defineStore("authStore", () => {
  const { updateUserInfo, updateTraderType } = $(coreStore());
  const { address, chainId, connector } = $(useAccount());
  const { isToken } = $(coreStore());
  const { updateWalletBalance } = $(useWalletStore());

  const { signMessageAsync } = useSignMessage();
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

    let user = await getUserInfo();
    let userProfile = await getUserProfile({
      proxyWallet: user.data.proxyWallet,
    });
    updateUserInfo(user.data);
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

    console.log("signLoginMessage message:", message);

    try {
      let res = await signMessageAsync(
        {
          connector: connector,
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
    showLoadingToast({
      message: "start to sign",
      forbidClick: true,
      loadingType: "spinner",
    });
    if (isSign) return;
    try {
      isSign = true;
      if (address) {
        console.log("todoSign address:", address);
        const nonceRes = await getNonce(address);
        if (nonceRes) {
          const signData = await signLoginMessage(nonceRes.data);
          console.log("the last step before loggin", signData);
          await todoLogin(signData);
        }
        closeToast();
      }
    } catch (error) {
      console.log("todoSign error", error);
      closeToast();
    } finally {
      isSign = false;
    }
  };

  // start login process
  const todoLogin = async (data: {
    message: SiweMessage;
    signature: string;
  }) => {
    showLoadingToast({
      message: "start to login",
      forbidClick: true,
      loadingType: "spinner",
    });
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
