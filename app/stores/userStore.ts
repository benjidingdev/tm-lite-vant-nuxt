import * as userApi from "~/api/userInfo";

export const userStore = defineStore("userStore", () => {
  const { token } = $(authStore());
  let userInfo = $ref({});
  let hasSetLocale = $ref(false);
  let order = $ref({
    positionList: [],
    openOrderList: [],
    historyList: [],
  });

  // refresh information
  const updateUserInfo = (data: any) => {
    userInfo = data;
  };

  //refresh user info after login
  const loadUserInfo = async () => {
    if (token.accessToken) {
      let user = await userApi.getUserInfo();
      updateUserInfo(user.data);
    }
  };

  return $$({
    userInfo,
    order,
    hasSetLocale,
    updateUserInfo,
    loadUserInfo,
  });
},
  {
    persist: {
      debug: true,
    },
  }
);

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(userStore, import.meta.hot));
}
