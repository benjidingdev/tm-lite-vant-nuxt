export const coreStore = defineStore("coreStore", () => {
  let traderType = $ref({});
  let tokenShow = $ref(false);

  // Actions
  const isToken = (flag: boolean) => {
    tokenShow = flag;
  };

  const updateTraderType = (type: any) => {
    traderType = type;
  };


  return $$({
    updateTraderType,
    traderType,
    isToken,
    tokenShow,
  });
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(coreStore, import.meta.hot));
}
