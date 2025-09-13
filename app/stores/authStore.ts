
import { getUserProfile } from "@/api/userInfo";
import { getLogout } from "~/api/login";
import * as walletApi from "~/api/wallet";
import { getAddress } from "viem";
import { createSiweMessage } from "viem/siwe";
import type { SiweMessage } from "@/types";

export const authStore = defineStore(
  "authStore",
  () => {
    const debug = useDebug('authStore')
    const { t } = $(useI18n());
    const { setModal, startOnboarding, setLoadingToast } = $(uiStore());
    let { loadUserInfo, userInfo } = $(userStore());
    const { amountPermit, updateWalletBalance } = $(walletStore());
    const { startParam } = $(shareStore());
    const { walletClient, wallet, logoutPrivy, isNewUser } = $(privyStore());
    let { session, errorInfo } = $(privyStore());

    let token: any = $ref({
      accessToken: "",
      expiresTime: "",
      openid: "",
      refreshToken: "",
      userId: "",
    });

    // refresh local cache token
    const updateToken = (tokenInfo: any) => {
      if (JSON.stringify(tokenInfo) === "{}") {
        Object.keys(token).forEach((key) => (token[key] = ""));
      } else {
        token = tokenInfo;
      }
    };

    const deleteAllCookies = () => {
      let cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        let eqPos = cookie.indexOf("=");
        let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie =
          name + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
      }
    };

    // refresh user login status after login successfully
    const afterLoginSuccess = async (data: any) => {
      updateToken(data.data);
      setModal("loginModal", false);
      await loadUserInfo();
      await getUserProfile({
        proxyWallet: userInfo.proxyWallet,
      });
      isNewUser && startOnboarding();
      await amountPermit();
      await updateWalletBalance();
    };

    // disconnect wallet and log out
    const logOut = async () => {
      try {
        showToast(t("Logging out..."));
        // hasSend = false;
        // isLoading = false;

        let res: any = await getLogout();
        if (res?.code === 0) {
          await logoutPrivy();
          deleteAllCookies();
          localStorage?.clear();
          sessionStorage?.clear();
          updateToken({});
          userInfo = {}
          session = null;
          errorInfo = null;
          showToast(t("Logout successful"));
        }
      } catch (e) {
        console.error("Logout Failure message：", e);
      }
    };

    /**
     * Sign in, after the user connects the wallet, call the backend service to get the message
     * Then request the signature, get the signature string, and call the backend interface to verify the signature
     */
    const signLoginMessage = async (nonce: string) => {
      try {
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

        let res = await walletClient.signMessage({
          account: address,
          message: message,
        });
        return { message: messageObj, signature: res };
      } catch (err) {
        throw err;
      }
    };

    const getNonce = async (_address: any) => {
      try {
        let res: any = await walletApi.getNonce({ proxyWallet: _address });
        return res;
      } catch (error) {
        throw error;
      }
    };

    //start login process
    const requestWalletLogin = async (data: {
      message: SiweMessage;
      signature: string;
    }) => {
      const address = wallet?.address;
      let result: any = await walletApi.loginByWallet({
        proxyWallet: address,
        ivcode: startParam.inviteCode || '',
        signature: data.signature,
        message: data.message,
      });
      if (result && result?.code === 0) {
        afterLoginSuccess(result);
      } else {
        console.error("Login failed:");
      }
      closeToast();
    };

    const doSign = useDebounceFn(async () => {
      setLoadingToast(t("Start to login"));
      let signData;
      const address = wallet?.address;
      debug({ address, wallet, walletClient })
      try {
        if (address) {
          const nonceRes = await getNonce(address);
          debug({nonceRes})
          if (nonceRes) {
            signData = await signLoginMessage(nonceRes.data);
          }
        }
      } catch (error) {
        debug({error})
        closeToast();
      }

      try {
        if (signData) {
          await requestWalletLogin(signData);
        }
      } catch (error: Error | any) {
        errorInfo = "request Wallet init API error: " + error.message;
      }
      closeToast();
    }, 100);

    watchEffect(async () => {
      if (!walletClient) return
      if (token.accessToken) return
      await doSign();
    })

    return $$({
      token,
      doSign,
      logOut,
      updateToken,
      afterLoginSuccess,
    });
  },
  {
    persist: {
      debug: true,
    },
  }
);

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(authStore, import.meta.hot));
}
