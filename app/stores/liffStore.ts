import { defineStore } from "pinia";
import liff from "@line/liff";

export interface LiffError {
  code: string;
  message: string;
  cause: unknown;
}
export interface Profile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

export const liffStore = defineStore(
  "liffStore",
  () => {
    const config = useRuntimeConfig();
    const endpointUrl = config.public.kaia?.endpointUrl as string;

    let isInitialized = $ref(false);
    let isLoginIn = $ref<boolean>();
    let profile = $ref<Profile>();
    let granted = $ref<Array<string>>();
    let friendship = $ref<boolean>();

    watchEffect(async () => {
      if (!isInitialized) return;
      if (liff.isLoggedIn() && !isLoginIn) {
        // login in
        isLoginIn = true;
        granted = await getGrantedAllScopes();
        if (
          !granted?.includes("profile") ||
          !granted?.includes("openid") ||
          !granted?.includes("chat_message.write")
        ) {
          await requestAll();
        }
        profile = await getProfile();
        friendship = await getFriendship();
      } else if (!liff.isLoggedIn() && isLoginIn) {
        // login out
        isLoginIn = false;
        profile = undefined;
        granted = undefined;
        friendship = undefined;
      }
    });

    const ready = async () => {
      return await liff.ready;
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

    const login = (path: string) => {
      if (!liff.isLoggedIn()) {
        liff.login({ redirectUri: `${endpointUrl}${path}` });
      }
    };

    const logout = () => {
      if (liff.isLoggedIn()) {
        liff.logout();
        if (!liff.isLoggedIn() && isLoginIn) {
          // login out
          isLoginIn = false;
          profile = undefined;
          granted = undefined;
          friendship = undefined;
        }
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
      try {
        let permissionStatus = await query("profile");
        if (permissionStatus.state === "prompt") {
          await liff.permission.requestAll();
        }
        permissionStatus = await query("openid");
        if (permissionStatus.state === "prompt") {
          await liff.permission.requestAll();
        }
        permissionStatus = await query("chat_message.write");
        if (permissionStatus.state === "prompt") {
          await liff.permission.requestAll();
        }
      } catch (err: any) {
        console.error("requestAll error", err);
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

    // https://developers.line.biz/en/reference/messaging-api/#message-objects
    const sendMessages = async (messages: Array<any>) => {
      if (liff.isLoggedIn()) {
        try {
          if (!granted?.includes("chat_message.write")) {
            await requestAll();
          }
          await liff.sendMessages(messages);
        } catch (err: any) {
          console.error("sendMessages error", err);
        }
      }
    };

    // https://developers.line.biz/en/reference/messaging-api/#message-objects
    const shareTargetPicker = async (
      messages: Array<any>,
      isMultiple: boolean
    ) => {
      if (liff.isLoggedIn()) {
        try {
          if (!granted?.includes("chat_message.write")) {
            await requestAll();
          }
          await liff.shareTargetPicker(messages, { isMultiple });
        } catch (err: any) {
          console.error("sendMessages error", err);
        }
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
      endpointUrl,
      isInitialized,
      isLoginIn,
      profile,
      granted,
      friendship,
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
      omit: ["isInitialized"],
    },
  }
);

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(liffStore, import.meta.hot));
}
