import { createWalletClient, createPublicClient, custom } from "viem";
import { getNetworks } from "~/config/networks";

export const privyStore = defineStore(
  "privyStore",
  () => {
    const { $privy, $PrivySDK } = useNuxtApp();
    const { updateWalletBalance } = $(walletStore());
    const { updateUserOrderAmountInfo } = $(userStore());
    const networks = getNetworks(useRuntimeConfig().public.isTestnet as boolean)

    let email = $ref("");
    let hasSend = $ref(false);
    let oneTimePassword = $ref("");
    let isLoading = $ref(false);
    let session = $ref(null);
    let errorInfo = $ref("");

    const doLogin = async () => {
      if (session) return;
      if (isLoading) return;
      isLoading = true;
      if (!hasSend) {
        const rz = await $privy.auth.email.sendCode(email);
        console.log("rz", rz);
        hasSend = true;
        isLoading = false;
        return;
      }

      try {
        session = await $privy.auth.email.loginWithCode(email, oneTimePassword);
        console.log("session", session);
        isLoading = false;
      } catch (error) {
        errorInfo = error;
        isLoading = false;
      }
    };

    const refreshSession = async () => {
      try {
        session = await $privy.user.get();
        console.log("session", session);
        await initWallet();
        await Promise.all([
          updateWalletBalance(),
          updateUserOrderAmountInfo(),
        ]);
      } catch (error) {
        console.log("privy get user error", error);
      }
    };

    const wallet = $computed(() => {
      const rz =
        session?.user?.linked_accounts?.find(
          (item) => item.type === "wallet"
        ) || null;
      // console.log('wallet', rz)
      return rz;
    });
    let walletClient = $ref(null);
    let publicClient = $ref(null);
    const userId = $computed(() => session?.user?.id || false);
    const initWallet = async () => {
      if (!userId || isLoading) return;
      isLoading = true;

      let theWallet = $PrivySDK.getUserEmbeddedWallet(session?.user);
      console.log("theWallet", theWallet);
      if (!theWallet) {
        theWallet = await $privy.embeddedWallet.create({});
        session = await $privy.user.get();
      }

      const { entropyId, entropyIdVerifier } =
        $PrivySDK.getEntropyDetailsFromUser(session?.user);
      console.log('xxx', {
        wallet,
        entropyId,
        entropyIdVerifier,
      }, session)
      const provider = await $privy.embeddedWallet.getEthereumProvider({
        wallet,
        entropyId,
        entropyIdVerifier,
      });
      walletClient = createWalletClient({
        account: wallet.address,
        chain: networks[0],
        transport: custom(provider),
      });
      publicClient = createPublicClient({
        chain: networks[0],
        transport: custom(provider),
      });
      console.log("walletClient", walletClient);

      isLoading = false;
    };

    const userEmail = $computed(() => {
      return (
        session?.user?.linked_accounts?.find((item) => item.type === "email")
          ?.address || ""
      );
    });

    const setupEmbeddedWalletIframe = (iframe: HTMLIFrameElement) => {
      const iframeUrl = $privy.embeddedWallet.getURL();
      iframe.src = iframeUrl;
      $privy.setMessagePoster(iframe.contentWindow);
      const listener = (e) => {
        try {
          $privy.embeddedWallet.onMessage(e.data);
          console.log(`privy.onEmbeddedWalletMessage: ${e.data.event}`, e.data);
        } catch (err) {
          // console.log('xxxx', err, e)
        }
      };
      window.addEventListener("message", listener);
      return () => {
        window.removeEventListener("message", listener);
      };
    };

    const sendEmail = async () => {
      if (isLoading) return;
      isLoading = true;
      await $privy.auth.email.sendCode(email);
      hasSend = true;
      isLoading = false;
      oneTimePassword = "";
      errorInfo = "";
    };

    const logoutPrivy = async () => {
      await $privy.auth.logout();
    };

    return $$({
      email,
      hasSend,
      oneTimePassword,
      isLoading,
      session,
      userId,
      wallet,
      userEmail,
      walletClient,
      publicClient,
      errorInfo,
      doLogin,
      initWallet,
      refreshSession,
      setupEmbeddedWalletIframe,
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
      ],
      debug: true,
    },
  }
);

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(privyStore, import.meta.hot));
}
