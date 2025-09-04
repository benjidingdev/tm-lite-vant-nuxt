export const uiStore = defineStore("uiStore", () => {
  let modalIsShow = $ref({
    settings: false,
    tradeSetting: false,
    langSwitcher: false,
    authLogout: false,
    share: false,
    showTradePicker: false,
    showRedeemPopup: false,
    loginModal: false,
    balanceModal: false,
    requestQueueErrorModal: false,
  });
  let keyBoardIsShow = $ref({
    settings: false,
  });
  let labelWidth = $ref("12em");
  let timeStamp = Date.now();

  const setModal = (
    name: keyof typeof modalIsShow,
    isShow: boolean,
    cb?: () => void
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
    keyBoardIsShow,
    setModal,
    setLoadingToast,
    showMsgDialog,
    setKeyBoard,
  });
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(uiStore, import.meta.hot));
}
