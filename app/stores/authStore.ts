import { useDisconnect } from "@wagmi/vue";
import { getUserInfo, getUserProfile } from "@/api/userInfo";
import { getLogout } from "~/api/login";

export const authStore = defineStore("authStore", () => {
  const { updateUserInfo, updateTraderType } = $(coreStore());

  const { disconnect } = useDisconnect();
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
      }
    } catch (e) {
      console.log('Failure message：', e)
    }
  };

  return $$({
    token,
    afterLoginSuccess,
    logOut,
    updateToken,
  });
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(authStore, import.meta.hot));
}
