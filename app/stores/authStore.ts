import { getUserInfo, getUserProfile } from "@/api/userInfo";

export const authStore = defineStore("authStore", () => {
  const { updateUserInfo, updateTraderType } = $(coreStore());
  let tokenShow = $ref(false);
  let token = $ref({
    token: {
      accessToken: "",
      expiresTime: "",
      openid: "",
      refreshToken: "",
      userId: "",
    },
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

  return $$({ isToken, tokenShow, token, afterLoginSuccess });
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(authStore, import.meta.hot));
}
