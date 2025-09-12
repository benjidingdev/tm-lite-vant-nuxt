import { createWalletClient, publicActions, custom } from "viem";

import { getNetworks } from "~/config/networks";

export const privyStore = defineStore(
  "privyStore",
  () => {
    const debug = useDebug('privyStore')
    const { $privy, $PrivySDK }: any = useNuxtApp();
    const { doSign } = $(authStore());

    const networks = getNetworks(useRuntimeConfig().public.isTestnet as boolean)

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
        debug({ session })
        await nextTick()
        await doSign()
        hasSend = false
      } catch (error: Error | any) {
        errorInfo = "login error: " + error.message;
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
        cleanupIframe();
      } catch (error) {
        console.log("privy logout error", error);
      }
    };

    // above wait for clear
    const initWallet = async () => {
      let theWallet = $PrivySDK.getUserEmbeddedWallet(session.user);
      let user = session.user
      if (!theWallet) {
        const rz = await $privy.embeddedWallet.create({});
        user = rz.user
        theWallet = $PrivySDK.getUserEmbeddedWallet(user);
      }
      debug({ theWallet })
      if (!theWallet) {
        debug({session})
        throw new Error("wallet not found");
      }
      wallet = theWallet

      debug({session})
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
      debug({walletClient})
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
      $privy.setMessagePoster(msgPoster);
      const listener = (e: MessageEvent) => {
        const target = e?.data?.target
        const targetArr = ['metamask-inpage']
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
      session = await $privy.user.get();

      cleanupIframe = () => {
        window.removeEventListener("message", listener);
        iframeRef!.src = "";
      };
    };

    watchEffect(async() => {
      if (iframeRef) {
        await setupEmbeddedWalletIframe()
      }
      if (session) {
        debug({session})
        await initWallet();
      }
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
        "wallet",
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
