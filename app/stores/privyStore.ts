import { createWalletClient, custom } from 'viem'
import { networks } from '~/config/networks'

export const privyStore = defineStore("privyStore", () => {
  const { $privy, $PrivySDK } = useNuxtApp();
  const { todoSign } = $(authStore());

  let email = $ref('Adam.Ma@TuringM.IO');
  let hasSend = $ref(false)
  let oneTimePassword = $ref('');
  let isLoading = $ref(false)
  let session = $ref(null)
  const doLogin = async () => {
    if(session) return
    if (isLoading) return
    isLoading = true
    if (!hasSend) {
        const rz = await $privy.auth.email.sendCode(email)
        console.log('rz', rz)
        hasSend = true
        isLoading = false
        return;
    }

    session = await $privy.auth.email.loginWithCode(email, oneTimePassword);
    console.log('session', session);
    isLoading = false
  };
  const refreshSession = async () => {
    session = await $privy.user.get()
    // console.log('refreshSession', session, walletClient)
    await initWallet()
    await todoSign()
  }
  const wallet = $computed(() => {
    const rz = session?.user?.linked_accounts?.find(item => item.type === 'wallet') || null
    // console.log('wallet', rz)
    return rz
  })
  let walletClient = $ref(null)
  const userId = $computed(() => session?.user?.id || false)
  const initWallet = async () => {
    if (!userId || isLoading) return
    isLoading = true
  
    let theWallet = $PrivySDK.getUserEmbeddedWallet(session?.user);

    if (!theWallet) {
      theWallet = await $privy.embeddedWallet.create({});
      session = await $privy.user.get()
    }

    const {entropyId, entropyIdVerifier} = $PrivySDK.getEntropyDetailsFromUser(session?.user);
    const provider = await $privy.embeddedWallet.getEthereumProvider({
      wallet,
      entropyId,
      entropyIdVerifier
    });
    walletClient = createWalletClient({
      account: wallet.address,
      chain: networks[0],
      transport: custom(provider),
    });
      
    isLoading = false
  }

  const userEmail = $computed(() => {
    return session?.user?.linked_accounts?.find(item => item.type === 'email')?.address || ''
  })

  const setupEmbeddedWalletIframe = (iframe: HTMLIFrameElement) => {
      const iframeUrl = $privy.embeddedWallet.getURL();
      iframe.src = iframeUrl;
      $privy.setMessagePoster(iframe.contentWindow);
    const listener = (e) => {
        try {
          $privy.embeddedWallet.onMessage(e.data)
          console.log(`privy.onEmbeddedWalletMessage: ${e.data.event}`, e.data)
        } catch (err) {
          // console.log('xxxx', err, e)
        }
      };
      window.addEventListener('message', listener);
      return () => {
        window.removeEventListener('message', listener);
      }
  }

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
    doLogin,
    initWallet,
    refreshSession,
    setupEmbeddedWalletIframe,
  });
}, {
  persist: {
    omit: ['isLoading', 'wallet'],
    debug: true,
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(privyStore, import.meta.hot));
}
