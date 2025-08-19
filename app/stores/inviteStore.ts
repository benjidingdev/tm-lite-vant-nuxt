export const inviteStore = defineStore("inviteStore", () => {
  const inviteCode = $computed(() => {
    if (window?.Telegram) {
      console.log(
        "window.Telegram.WebApp.initDataUnsafe",
        window.Telegram.WebApp.initDataUnsafe
      );
      const str = window?.Telegram?.WebApp?.initDataUnsafe?.start_param;
      let code = "";
      if (str) {
        code = str.split("inviteCode=")[1];
      }
      return code;
    } else {
      const urlParams = new URLSearchParams(window?.location?.search);
      const code = urlParams.get("inviteCode");
      return code;
    }
  });

  return $$({
    inviteCode,
  });
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(inviteStore, import.meta.hot));
}
