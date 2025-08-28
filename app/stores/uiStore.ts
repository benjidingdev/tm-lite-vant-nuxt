export const uiStore = defineStore("uiStore", () => {
  let modalIsShow = $ref({
    settings: false,
    tradeSetting: false,
    langSwitcher: false,
    authLogout: false,
    share: false,
    showTradePicker: false,
    loginModal: false,
    balanceModal: false,
  });
  let keyBoardIsShow = $ref({
    settings: false,
  });
  let labelWidth = $ref("12em");
  let firstCall = $ref({
    position: false,
    openOrder: false,
    history: false,
  });
  let timeStamp = Date.now();

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

  const triggerCallDuration = (currentTS: any, duration: number) => {
    try {
      const gap = currentTS - timeStamp
      // duration is seconds
      if (gap > duration * 1000) {
        timeStamp = Date.now()
        return true
      } else {
        return false
      }
    } catch (error) {
      return true
    }
  }

  return $$({
    labelWidth,
    modalIsShow,
    keyBoardIsShow,
    firstCall,
    setModal,
    setLoadingToast,
    showMsgDialog,
    setKeyBoard,
    triggerCallDuration,
  });
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(uiStore, import.meta.hot));
}
