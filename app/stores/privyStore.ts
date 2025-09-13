import { createWalletClient, publicActions, custom } from "viem";

import { getNetworks } from "~/config/networks";

export const privyStore = defineStore(
  "privyStore",
  () => {
    const debug = useDebug('privyStore')
    const { $privy, $PrivySDK }: any = useNuxtApp();
    const { token } = $(authStore());
    const networks = getNetworks(useRuntimeConfig().public.isTestnet as boolean)
    const { setLoadingToast } = $(uiStore());
    const { t } = $(useI18n());

    let email = $ref("");
    let hasSend = $ref(false);
    let oneTimePassword = $ref("");
    let isLoading = $ref(false);
    let session: any = $ref(null);
    const isNewUser = $computed(() => {
      return session?.user?.is_new_user
    })
    let errorInfo: any = $ref('');
    let walletClient: any = $ref(null);
    let cleanupIframe: () => void = () => { };
    let iframeRef: (HTMLIFrameElement | null) = $ref(null);

    const userId = $computed(() => session?.user?.id || false);
    let wallet = $ref<any>(null)
    const userEmail = $computed(() => {
      return (
        session?.user?.linked_accounts?.find((item: any) => item.type === "email")
          ?.address || ""
      );
    });

    const doLogin = async () => {
      if(isLoading) return
      isLoading = true;

      try {
        session = await $privy.auth.email.loginWithCode(email, oneTimePassword);
        debug({ session, action: 'doLogin' })
        hasSend = false
      } catch (error: Error | any) {
        errorInfo = "login error: " + error.message;
        debug({errorInfo, action: 'doLogin'})
      }
      isLoading = false;
    };

    const sendEmail = async () => {
      errorInfo = "";
      if (isLoading || !email) return;
      isLoading = true;
      try {
        await $privy.auth.email.sendCode(email);
        hasSend = true;
      } catch (error: Error | any) {
        errorInfo = error.message || "Send email error";
      }
      isLoading = false;
      oneTimePassword = "";
    };

    const logoutPrivy = async () => {
      try {
        await $privy.auth.logout();
        session = null;
        wallet = null;
        email = '';
        walletClient = null;
      } catch (error) {
        debug({ error, action: 'logoutPrivy' })
      }
      cleanupIframe();
    };

    // above wait for clear
    let isInitWallet = false
    const initWallet = async () => {
      if (isInitWallet) return
      isInitWallet = true
      setLoadingToast(t("Initializing wallet..."));
      try {
        let theWallet = $PrivySDK.getUserEmbeddedWallet(session.user);
        let user = session.user
        if (!theWallet) {
          const rz = await $privy.embeddedWallet.create({});
          user = rz.user
          theWallet = $PrivySDK.getUserEmbeddedWallet(user);
        }
        debug({ theWallet })
        if (!theWallet) {
          debug({ session })
          throw new Error("wallet not found");
        }
        wallet = theWallet

        debug({ session })
        const { entropyId, entropyIdVerifier } = $PrivySDK.getEntropyDetailsFromUser(user);
        const provider = await $privy.embeddedWallet.getEthereumProvider({
          wallet: theWallet,
          entropyId,
          entropyIdVerifier,
        });

        walletClient = createWalletClient({
          account: theWallet.address,
          chain: networks[0],
          transport: custom(provider),
        }).extend(publicActions)
        debug({ walletClient })
      } catch (error) {
        debug({ error, action: 'initWallet' })
      } finally {
        isInitWallet = false
      }
    }

    const msgPoster = {
      postMessage: (msg: any, targetOrigin: string) => {
        // debug({ tag: 'postMessage', msg, targetOrigin })
        return iframeRef!.contentWindow!.postMessage(msg, targetOrigin)
      },
      reload: async () => {
        debug({ action: 'reload' })
      },
    }

    const setupEmbeddedWalletIframe = async() => {
      const iframeUrl = $privy.embeddedWallet.getURL();
      iframeRef!.src = iframeUrl;
      debug({ iframeUrl })
      $privy.setMessagePoster(msgPoster);
      const listener = (e: MessageEvent) => {
        const target = e?.data?.target
        const targetArr = ['metamask-inpage', 'metamask-contentscript']
        if (target && targetArr.includes(target)) {
          return;
        }
        switch (e.data.event) {
          case 'privy:iframe:ready':
            debug({privyIsReady: true})
            break;
          default:
            debug({ 'privy:iframe': e, origin: e.origin })
            break;
        }
        try {
          $privy.embeddedWallet.onMessage(e.data);
        } catch (err) {
          debug({ 'privy:iframe:error': err, e })
        }

      };
      window.addEventListener("message", listener);
      try {
        session = await $privy.user.get();
      } catch (error) {
        debug({ error, action: 'setupEmbeddedWalletIframe' })
      }

      cleanupIframe = async () => {
        window.removeEventListener("message", listener);
        iframeRef!.src = "";
        await setupEmbeddedWalletIframe()
      };
    };

    watchEffect(async() => {
      if (!iframeRef) return
      await setupEmbeddedWalletIframe()
    })

    watch(() => userId, async (newVal) => {
      if(!newVal) return
      if(token.accessToken) return
      await initWallet();
    })

    return $$({
      iframeRef,
      email,
      hasSend,
      oneTimePassword,
      isLoading,
      session,
      userId,
      wallet,
      userEmail,
      walletClient,
      errorInfo,
      isNewUser,
      doLogin,
      initWallet,
      setupEmbeddedWalletIframe,
      cleanupIframe,
      logoutPrivy,
      sendEmail,
    });
  },
  {
    persist: {
      omit: [
        "isLoading",
        "userId",
        "oneTimePassword",
        "hasSend",
        "errorInfo",
        "initWallet",
      ],
      debug: true,
    },
  }
);

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(privyStore, import.meta.hot));
}
