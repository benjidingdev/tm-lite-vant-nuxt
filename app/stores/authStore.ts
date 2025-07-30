import { useDisconnect } from "@wagmi/vue";
import { getUserInfo, getUserProfile } from "@/api/userInfo";
import { getLogout } from "~/api/login";

export const authStore = defineStore("authStore", () => {
  const { updateUserInfo, updateTraderType } = $(coreStore());

  //   const { disconnectWallet } = $(useWalletStore());
  const { disconnect } = useDisconnect();
  let tokenShow = $ref(false);
  let token = $ref({
    accessToken: "",
    expiresTime: "",
    openid: "",
    refreshToken: "",
    userId: "",
  });

  //if show login modal
  const isToken = (flag: boolean) => {
    //console.log('isToken:', flag)
    tokenShow = flag;
  };

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

    // get user info
    let user = await getUserInfo();
    let userProfile = await getUserProfile({
      proxyWallet: user.data.proxyWallet,
    });
    updateUserInfo(user.data);
    updateTraderType(userProfile.data.traderType);
  };

  const logOut = async () => {
    try {
      let res: any = await getLogout();
      if (res.code === 0) {
        updateToken({});
        // disconnectWallet();
        disconnect();
        updateUserInfo({});
        // store.clearTuitBalance();
        // store.clearPointsBalance();
        // handleClose();
        // websocket.close();
        // websocket.connect();
      }
    } catch (e) {
      //console.log('Failure message：', e)
    }
  };

  return $$({
    isToken,
    tokenShow,
    token,
    afterLoginSuccess,
    logOut,
    updateToken,
  });
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(authStore, import.meta.hot));
}
