
import type { SiweMessage } from "@/types";
import { getUserProfile } from "@/api/userInfo";
import { getLogout } from "~/api/login";
import * as walletApi from "~/api/wallet";

export const authStore = defineStore(
  "authStore",
  () => {
    const { t } = useI18n();
    const { setModal, startOnboarding } = $(uiStore());
    let { loadUserInfo, userInfo } = $(userStore());
    const { amountPermit } = $(
      walletStore()
    );

    let {
      logoutPrivy,
      hasSend,
      isLoading,
      session,
      errorInfo,
      wallet
    } = $(privyStore());

    let token = $ref({
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
      await amountPermit();
      startOnboarding();
    };

    // disconnect wallet and log out
    const logOut = async () => {
      try {
        showToast(t("Logging out..."));
        hasSend = false;
        isLoading = false;
        await logoutPrivy();

        let res: any = await getLogout();
        if (res?.code === 0) {
          deleteAllCookies();
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

    return $$({
      token,
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
