import * as userApi from "~/api/userInfo";

export const coreStore = defineStore("coreStore", () => {
  const { token } = $(authStore());
  let userInfo = $ref({});
  let traderType = $ref({});
  let volume = $ref(1);

  // refresh information
  const updateUserInfo = (userInfo: any) => {
    userInfo = userInfo;
  };

  const updateTraderType = (type: any) => {
    traderType = type;
  };

  const updateVolume = (volume_: any) => {
    console.log("updateVolume", volume_);
    volume = volume_;
  };

  //refresh user info after login
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
    volume,
    updateVolume,
  });
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(coreStore, import.meta.hot));
}
