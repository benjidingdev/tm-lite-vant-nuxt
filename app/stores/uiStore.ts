export const uiStore = defineStore("uiStore", () => {
  let modalIsShow = $ref({
    settings: false,
    tradeSetting: false,
    langSwitcher: false,
  })
  let labelWidth = $ref('12em')
  const setModal = (name: keyof typeof modalIsShow, isShow: boolean) => {
    modalIsShow[name] = isShow
  }

  return $$({
    labelWidth,
    modalIsShow,
    setModal,
  });
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(uiStore, import.meta.hot));
}
