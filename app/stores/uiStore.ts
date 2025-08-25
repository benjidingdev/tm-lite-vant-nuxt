export const uiStore = defineStore("uiStore", () => {
  let modalIsShow = $ref({
    settings: false,
    tradeSetting: false,
    langSwitcher: false,
    authLogout: false,
    share: false,
    showTradePicker: false,
    loginModal: false,
  });
  let keyBoardIsShow = $ref({
    settings: false,
  });

  let labelWidth = $ref("12em");

  const setModal = (
    name: keyof typeof modalIsShow,
    isShow: boolean,
    cb: () => {}
  ) => {
    modalIsShow[name] = isShow;
    if (typeof cb === "function") {
      cb();
    }
  };

  const setKeyBoard = (name: keyof typeof keyBoardIsShow, isShow: boolean) => {
    keyBoardIsShow[name] = isShow;
  };

  const setLoadingToast = (message: string) =>
    showLoadingToast({
      message,
      forbidClick: true,
      loadingType: "spinner",
      duration: 0,
      wordBreak: "normal",
    });

  const showMsgDialog = (title: string, message: string) =>
    showDialog({
      title,
      message,
      confirmButtonText: "OK",
    });

  return $$({
    labelWidth,
    modalIsShow,
    setModal,
    setLoadingToast,
    showMsgDialog,
    keyBoardIsShow,
    setKeyBoard,
  });
}, {
  persist: {
    omit: ['isLoading', 'wallet'],
    debug: true,
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(uiStore, import.meta.hot));
}
