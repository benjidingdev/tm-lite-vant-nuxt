export const inviteStore = defineStore("inviteStore", () => {
  const inviteCode = $computed(() => {
    if (window?.Telegram) {
      console.log(
        "window.Telegram.WebApp.initDataUnsafe",
        window.Telegram.WebApp.initDataUnsafe
      );
      return window?.Telegram?.WebApp?.initDataUnsafe?.start_param;
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
