export const coreStore = defineStore("coreStore", () => {
  let userInfo = $ref({});
  let traderType = $ref({});

  // refresh information
  const updateUserInfo = (userInfo: any) => {
    userInfo = userInfo;
  };

  const updateTraderType = (type: any) => {
    traderType = type;
  };

  return $$({ updateUserInfo, userInfo, updateTraderType, traderType });
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(coreStore, import.meta.hot));
}
