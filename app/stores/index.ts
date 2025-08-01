import * as userApi from "~/api/userInfo";

export const coreStore = defineStore("coreStore", () => {
  const { token } = $(authStore());
  let userInfo = $ref({});
  let traderType = $ref({});

  // refresh information
  const updateUserInfo = (userInfo: any) => {
    userInfo = userInfo;
  };

  const updateTraderType = (type: any) => {
    traderType = type;
  };

  /**
   *
   * refresh user info after login
   */
  const loadUserInfo = async () => {
    if (token.accessToken) {
      let user = await userApi.getUserInfo();
      updateUserInfo(user.data);
    }
  };

  return $$({
    updateUserInfo,
    userInfo,
    updateTraderType,
    traderType,
    loadUserInfo,
  });
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(coreStore, import.meta.hot));
}
