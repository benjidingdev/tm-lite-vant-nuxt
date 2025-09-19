import { defineStore } from "pinia";
import liff from "@line/liff";

export const liffStore = defineStore(
  "liffStore",
  () => {
    const { locale } = useI18n();
    const config = useRuntimeConfig();
    const liffId = config.public.kaia?.liffId as string;
    const endpointUrl = config.public.kaia?.endpointUrl as string;

    liff.init({ liffId });
    liff.i18n.setLang(locale.value);

    const ready = () => {
      return liff.ready;
    };

    const getOS = () => {
      return liff.getOS();
    };

    const getAppLanguage = () => {
      return liff.getAppLanguage();
    };

    const getLanguage = () => {
      return liff.getLanguage();
    };

    const getVersion = () => {
      return liff.getVersion();
    };

    const login = () => {
      if (!liff.isLoggedIn()) {
        liff.login({ redirectUri: endpointUrl });
      }
    };

    const logout = () => {
      if (liff.isLoggedIn()) {
        liff.logout();
      }
    };

    const getAccessToken = () => {
      if (liff.isLoggedIn()) {
        return liff.getAccessToken();
      }
    };

    const getIDToken = () => {
      if (liff.isLoggedIn()) {
        return liff.getIDToken();
      }
    };

    const getDecodedIDToken = () => {
      if (liff.isLoggedIn()) {
        return liff.getDecodedIDToken();
      }
    };

    const getGrantedAllScopes = async () => {
      if (liff.isLoggedIn()) {
        return await liff.permission.getGrantedAll();
      }
    };

    const query = async (
      permission: "profile" | "chat_message.write" | "openid" | "email"
    ) => {
      return await liff.permission.query(permission);
    };

    const requestAll = async () => {
      const permissionStatus = await query("profile");
      if (permissionStatus.state === "prompt") {
        await liff.permission.requestAll();
      }
    };

    const getProfile = async () => {
      if (liff.isLoggedIn()) {
        return await liff.getProfile();
      }
    };

    const getFriendship = async () => {
      if (liff.isLoggedIn()) {
        const data = await liff.getFriendship();
        return data.friendFlag;
      }
    };

    const openWindow = (url: string, external: boolean) => {
      liff.openWindow({ url, external });
    };

    const closeWindow = () => {
      liff.closeWindow();
    };

    const sendMessages = async (messages: []) => {
      if (liff.isLoggedIn()) {
        await liff.sendMessages(messages);
      }
    };

    const shareTargetPicker = async (messages: [], isMultiple: boolean) => {
      if (liff.isLoggedIn()) {
        await liff.shareTargetPicker(messages, { isMultiple });
      }
    };

    const scanCodeV2 = async () => {
      return await liff.scanCodeV2();
    };

    const createUrlBy = async (url: string) => {
      return await liff.permanentLink.createUrlBy(url);
    };

    return $$({
      liff,
      ready,
      getOS,
      getAppLanguage,
      getLanguage,
      getVersion,
      login,
      logout,
      getAccessToken,
      getIDToken,
      getDecodedIDToken,
      getGrantedAllScopes,
      query,
      requestAll,
      getProfile,
      getFriendship,
      openWindow,
      closeWindow,
      sendMessages,
      shareTargetPicker,
      scanCodeV2,
      createUrlBy,
    });
  },
  {
    // @ts-ignore
    persist: {
      debug: true,
    },
  }
);

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(liffStore, import.meta.hot));
}
