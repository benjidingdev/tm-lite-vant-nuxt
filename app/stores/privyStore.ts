import { createWalletClient, createPublicClient, custom, getAddress } from "viem";
import { createSiweMessage } from "viem/siwe";
import type { SiweMessage } from "@/types";
import { getNetworks } from "~/config/networks";
import * as walletApi from "~/api/wallet";
import { log } from "logrocket";

export const privyStore = defineStore(
  "privyStore",
  () => {
    const { t } = useI18n();
    const { $privy, $PrivySDK } = useNuxtApp();
    const { updateWalletBalance } = $(walletStore());
    const { updateUserOrderAmountInfo } = $(userStore());
    const { startParam } = $(shareStore());
    const { setLoadingToast } = $(uiStore());
    let { afterLoginSuccess, token } = $(authStore());
    const networks = getNetworks(useRuntimeConfig().public.isTestnet as boolean)

    let email = $ref("");
    let hasSend = $ref(false);
    let oneTimePassword = $ref("");
    let isLoading = $ref(false);
    let session: any = $ref(null);
    let errorInfo: any = $ref('');
    let walletClient: any = $ref(null);
    let publicClient: any = $ref(null);
    let cleanupIframe: (() => void) | null = null;
    let iframeRef: (HTMLIFrameElement | null) = $ref(null);



    const userId = $computed(() => session?.user?.id || false);
    const wallet = $computed(() => {
      const rz =
        session?.user?.linked_accounts?.find(
          (item: any) => item.type === "wallet"
        ) || null;
      return rz;
    });
    const userEmail = $computed(() => {
      return (
        session?.user?.linked_accounts?.find((item: any) => item.type === "email")
          ?.address || ""
      );
    });


    // send email to get one time password
    const sendEmail = async () => {
      errorInfo = "";
      if (isLoading) return;
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

    // ======== Check login logic in this function( Main login function) =======
    const doLogin = async () => {
      if (session || isLoading) {
        console.log("===session===", session);
        return;
      }
      setupEmbeddedWalletIframe(iframeRef);
      isLoading = true;

      try {
        session = await $privy.auth.email.loginWithCode(email, oneTimePassword);
        console.log("session", session);
      } catch (error: Error | any) {
        errorInfo = "login error: " + error.message;
      }
      await initWallet();
      if (publicClient && walletClient) {
        await doSign();
      }
      isLoading = false;
    };

    const initWallet = async () => {
      try {
        if (!session || !userId) return;
        // await _initWallet($PrivySDK, session, $privy, wallet, createWalletClient, createPublicClient, custom, networks)
        const rz = await retryAsyncFn(() => _initWallet($PrivySDK, session, $privy, createWalletClient, createPublicClient, custom, networks), 5, 200)
        console.log("initWallet success", rz);
        walletClient = rz.walletClient;
        publicClient = rz.publicClient;
        session = rz.session;
      } catch (error: Error | any) {
        errorInfo = "init wallet error: " + error.message;
      }
    };

    // sign message by wallet
    const doSign = async () => {
      setLoadingToast(t("Start to login"));
      let signData;
      try {
        const address = wallet?.address;
        if (address) {
          console.log("doSign address:", address);
          const nonceRes = await getNonce(address);
          if (nonceRes) {
            signData = await signLoginMessage(nonceRes.data);
          }
        }
      } catch (error: Error | any) {
        errorInfo = "doSign error: " + error.message;
      }

      try {
        if (signData) {
          await requestWalletLogin(signData);
        }
      } catch (error: Error | any) {
        errorInfo = "request Wallet init API error: " + error.message;
      }
      closeToast();
    };

    /**
     * Sign in, after the user connects the wallet, call the backend service to get the message
     * Then request the signature, get the signature string, and call the backend interface to verify the signature
     */
    const signLoginMessage = async (nonce: string) => {
      try {
        const address = wallet?.address;
        const chainId = walletClient.chain?.id;
        const messageObj = {
          address: getAddress(address),
          chainId: chainId as number,
          domain: location.host,
          nonce,
          uri: location.origin,
          version: "1" as "1",
          issuedAt: new Date(),
          expirationTime: new Date(Date.now() + 60000),
          statement:
            "I accept the TuringM Terms of Service: https://TuringM.io/terms",
        } as SiweMessage;
        const message = createSiweMessage(messageObj);

        let res = await walletClient.signMessage({
          account: address,
          message: message,
        });
        return { message: messageObj, signature: res };
      } catch (err) {
        throw err;
      }
    };

    //start login process
    const requestWalletLogin = async (data: {
      message: SiweMessage;
      signature: string;
    }) => {
      const address = wallet?.address;
      let result: any = await walletApi.loginByWallet({
        proxyWallet: address,
        email: userEmail,
        ivcode: startParam.inviteCode || '',
        signature: data.signature,
        message: data.message,
      });
      if (result && result?.code === 0) {
        afterLoginSuccess(result);
        await updateWalletBalance();
      } else {
        console.error("Login failed:");
      }
      closeToast();
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
        session = null;
        console.log("privy get user error", error);
      }
    };

    const setupEmbeddedWalletIframe = (iframe: HTMLIFrameElement | null) => {
      const iframeUrl = $privy.embeddedWallet.getURL();
      iframe!.src = iframeUrl;
      $privy.setMessagePoster(iframe!.contentWindow);
      const listener = (e) => {
        try {
          $privy.embeddedWallet.onMessage(e.data);
          console.log(`privy.onEmbeddedWalletMessage: ${e.data.event}`, e.data);
        } catch (err) {
          // console.log('xxxx', err, e)
        }
      };
      window.addEventListener("message", listener);

      cleanupIframe = () => {
        window.removeEventListener("message", listener);
        iframe!.src = "";
        // iframe!.contentWindow.location.reload()
      };
    };

    const getNonce = async (_address: any) => {
      try {
        let res: any = await walletApi.getNonce({ proxyWallet: _address });
        return res;
      } catch (error) {
        throw error;
      }
    };

    const logoutPrivy = async () => {
      try {

        await $privy.auth.logout();
        console.log(cleanupIframe);

        cleanupIframe()
      } catch (error) {
        console.log("privy logout error", error);
      }
    };

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
      publicClient,
      errorInfo,
      doLogin,
      initWallet,
      refreshSession,
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
        "session",
        "initWallet",
      ],
      debug: true,
    },
  }
);

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(privyStore, import.meta.hot));
}
