export const uiStore = defineStore("uiStore", () => {
  let modalIsShow = $ref({
    settings: false,
    tradeSetting: false,
    langSwitcher: false,
    authLogout: false,
  });
  let labelWidth = $ref("12em");
  const setModal = (name: keyof typeof modalIsShow, isShow: boolean) => {
    modalIsShow[name] = isShow;
  };
  const setLoadingToast = (message: string) =>
    showLoadingToast({
      message,
      forbidClick: true,
      loadingType: "spinner",
    });

  return $$({
    labelWidth,
    modalIsShow,
    setModal,
    setLoadingToast,
  });
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(uiStore, import.meta.hot));
}
