import * as userApi from "~/api/userInfo";

export const coreStore = defineStore("coreStore", () => {
  const { token } = $(authStore());
  let userInfo = $ref({});
  let traderType = $ref({});
  let volumn = $ref(1);
  // refresh information
  const updateUserInfo = (userInfo: any) => {
    userInfo = userInfo;
  };

  const updateTraderType = (type: any) => {
    traderType = type;
  };

  const updateVolumn = (volumn: any) => {
    volumn = volumn;
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
    volumn,
    updateVolumn,
  });
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(coreStore, import.meta.hot));
}
