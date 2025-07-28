export const uiStore = defineStore("uiStore", () => {
  let settingModalShow = $ref(false);

  const setSettingModalShow = (value: boolean) => {
    settingModalShow = value;
  };

  return $$({ settingModalShow, setSettingModalShow });
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(uiStore, import.meta.hot));
}
