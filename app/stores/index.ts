import * as userApi from "~/api/userInfo";

export const coreStore = defineStore("coreStore", () => {
  const { token } = $(authStore());
  let userInfo = $ref({});
  let traderType = $ref({});
  let volume = $ref(1);
  let userBalance = $ref(0);
  let tokenBalance = $ref(0.0);
  let tokenShow = $ref(false);
  const userCapital = $ref({
    total: 0,
    balance: 0,
    freez: 0,
    frozen: 0,
    position: 0,
  });

  // Actions
  const isToken = (flag: boolean) => {
    tokenShow = flag;
  };

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

  const updateUserBalance = (balance: number) => {
    userBalance = balance || 0;
    userCapital.total = userBalance + userCapital.position;
  };

  const updateTokenBalance = (balance: number) => {
    tokenBalance = balance || 0;
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
    updateUserBalance,
    userBalance,
    userCapital,
    tokenBalance,
    updateTokenBalance,
    isToken,
    tokenShow,
  });
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(coreStore, import.meta.hot));
}
