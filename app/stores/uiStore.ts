export const uiStore = defineStore("uiStore", () => {
  let settingModalShow = $ref(false);
  let tradeModalShow = $ref(false);

  const setSettingModalShow = (value: boolean) => {
    settingModalShow = value;
  };
  const setTradeModalShow = (value: boolean) => {
    tradeModalShow = value;
  };

  return $$({
    settingModalShow,
    tradeModalShow,
    setSettingModalShow,
    setTradeModalShow,
  });
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(uiStore, import.meta.hot));
}
