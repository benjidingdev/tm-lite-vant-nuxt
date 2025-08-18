import * as userApi from "~/api/userInfo";

export const userStore = defineStore("userStore", () => {
  const { token } = $(authStore());
  let userInfo = $ref({});

  // refresh information
  const updateUserInfo = (userInfo: any) => {
    userInfo = userInfo;
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
    loadUserInfo,
  });
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(userStore, import.meta.hot));
}
