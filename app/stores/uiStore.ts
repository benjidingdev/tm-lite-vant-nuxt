export const uiStore = defineStore("uiStore", () => {
  let modalIsShow = $ref({
    setting: true,
    tradeVolume: false,
    langSwitcher: false,
  })

  const setModal = (name: keyof typeof modalIsShow, isShow: boolean) => {
    modalIsShow[name] = isShow
  }

  // to be delete
  let settingModalShow = $ref(false);
  let tradeModalShow = $ref(false);

  const setSettingModalShow = (value: boolean) => {
    settingModalShow = value;
  };
  const setTradeModalShow = (value: boolean) => {
    tradeModalShow = value;
  };

  return $$({
    modalIsShow,
    setModal,
    // to be delete
    settingModalShow,
    tradeModalShow,
    setSettingModalShow,
    setTradeModalShow,
  });
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(uiStore, import.meta.hot));
}
