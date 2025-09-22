import { defineStore } from "pinia";
import { fromBase64 } from "@/utils/inviteUtils";

export const tgStore = defineStore(
  "tgStore",
  () => {
    let webApp: any = undefined;
    let isInitialized = $ref<boolean>(false);
    let startParams = $ref<Record<string, string>>();
    const botUsername = useRuntimeConfig().public.tgBotInfo;

    const initialize = () => {
      webApp = window.Telegram.WebApp;
      if (webApp) {
        isInitialized = true;

        // read param
        let base64Params = webApp.initDataUnsafe?.start_param || "";
        if (base64Params) {
          startParams = fromBase64(base64Params);
        }

        // https://core.telegram.org/bots/webapps#events-available-for-mini-apps
        webApp.onEvent((eventType: string, eventHandler: any) => {
          switch (eventType) {
            case "themeChanged":
              console.log("themeChanged", webApp.colorScheme);
              break;
            case "shareMessageSent":
              console.log("shareMessageSent", eventHandler);
              break;
            case "shareMessageFailed":
              console.log("shareMessageFailed", eventHandler);
              break;
            case "emojiStatusSet":
              console.log("emojiStatusSet", eventHandler);
              break;
            case "emojiStatusFailed":
              console.log("emojiStatusFailed", eventHandler);
              break;
            case "emojiStatusAccessRequested":
              console.log("emojiStatusAccessRequested", eventHandler);
              break;
          }
        });
      }
    };

    const initData = () => {
      if (!isInitialized) return;
      return webApp.initData;
    };

    const initDataUnsafe = () => {
      if (!isInitialized) return;
      return webApp.initDataUnsafe;
    };

    const version = () => {
      if (!isInitialized) return;
      return webApp.version;
    };

    const platform = () => {
      if (!isInitialized) return;
      return webApp.platform;
    };

    const colorScheme = () => {
      if (!isInitialized) return;
      return webApp.colorScheme;
    };

    // Determine whether the applet is opened or minimized
    const isActive = () => {
      if (!isInitialized) return;
      return webApp.isActive;
    };

    const isExpanded = () => {
      if (!isInitialized) return;
      return webApp.isExpanded;
    };

    const isFullscreen = () => {
      if (!isInitialized) return;
      return webApp.isFullscreen;
    };

    // https://core.telegram.org/bots/webapps#backbutton
    const getBackButton = () => {
      if (!isInitialized) return;
      return webApp.backButton;
    };

    // https://core.telegram.org/bots/webapps#bottombutton
    const getMainButton = () => {
      if (!isInitialized) return;
      return webApp.mainButton;
    };

    // https://core.telegram.org/bots/webapps#settingsbutton
    const getSettingsButton = () => {
      if (!isInitialized) return;
      return webApp.settingsButton;
    };

    // A method that enables a confirmation dialog while the user is trying to close the Mini App.
    const enableClosingConfirmation = () => {
      if (!isInitialized) return;
      return webApp.enableClosingConfirmation();
    };

    // A method that disables the confirmation dialog while the user is trying to close the Mini App.
    const disableClosingConfirmation = () => {
      if (!isInitialized) return;
      return webApp.disableClosingConfirmation();
    };

    // https://core.telegram.org/bots/api#message
    const sendData = (data: string) => {
      if (!isInitialized) return;
      return webApp.sendData(data);
    };

    const switchInlineQuery = (
      query: string,
      chooseChatTypes: ("users" | "bots" | "groups" | "channels")[] = []
    ) => {
      if (!isInitialized) return;
      return webApp.switchInlineQuery(query, chooseChatTypes);
    };

    const openLink = (
      url: string,
      options: { try_instant_view?: boolean } = {}
    ) => {
      if (!isInitialized) return;
      return webApp.openLink(url, options);
    };

    const openTelegramLink = (url: string) => {
      if (!isInitialized) return;
      return webApp.openTelegramLink(url);
    };

    const shareMessage = (
      msg_id: string,
      callback?: (success: boolean) => void
    ) => {
      if (!isInitialized) return;
      return webApp.shareMessage(msg_id, callback);
    };

    // bot api //

    const savePreparedInlineMessage = () => {
      if (!isInitialized) return;
      return "";
    };

    return $$({
      webApp,
      isInitialized,
      botUsername,
      startParams,
      initialize,
      initData,
      initDataUnsafe,
      version,
      platform,
      colorScheme,
      isActive,
      isExpanded,
      isFullscreen,
      getBackButton,
      getMainButton,
      getSettingsButton,
      enableClosingConfirmation,
      disableClosingConfirmation,
      sendData,
      switchInlineQuery,
      openLink,
      openTelegramLink,
      shareMessage,
    });
  },
  {
    // @ts-ignore
    persist: {
      debug: true,
      omit: ["isInitialized"],
    },
  }
);

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(liffStore, import.meta.hot));
}
