export const privyStore = defineStore("privyStore", () => {
  const { $privy, $PrivySDK } = useNuxtApp();

  let email = $ref('Adam.Ma@TuringM.IO');
  let hasSend = $ref(false)
  let oneTimePassword = $ref('');
  let isLoading = $ref(false)
  let session = $ref(null)
  const doLogin = async () => {
    console.log('xxxx', session)
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

  const userId = $computed(() => session?.user?.id || false)
  let wallet = $ref(null)
  const doCreateWallet = async () => {
    if (!userId || isLoading || wallet) return
    isLoading = true
    console.log('doCreateWallet')
    wallet = await $privy.embeddedWallet.create({});
    console.log('wallet', wallet)
    return
    wallet = $PrivySDK.getUserEmbeddedEthereumWallet(user);
    const {entropyId, entropyIdVerifier} = $PrivySDK.getEntropyDetailsFromUser(user);
    const provider = await $privy.embeddedWallet.getEthereumProvider({
      wallet,
      entropyId,
      entropyIdVerifier
    });
    console.log('doCreateWallet end', provider, wallet, entropyId, entropyIdVerifier)
        
    isLoading = false
  }

  const userEmail = $computed(() => {
    return session?.user?.linked_accounts?.find(item => item.type === 'email')?.address || ''
  })

  const setupEmbeddedWalletIframe = () => {
      const iframeUrl = $privy.embeddedWallet.getURL();
      const iframe = document.createElement('iframe');
      iframe.src = iframeUrl;
      document.body.appendChild(iframe);
      $privy.setMessagePoster(iframe.contentWindow);
      const listener = (e) => {
        console.log('xxxx', e.data)
        $privy.embeddedWallet.onMessage(e.data)
      };
      window.addEventListener('message', listener);
  }

  return $$({
    email,
    hasSend,
    oneTimePassword,
    isLoading,
    session,
    userId,
    userEmail,
    doLogin,
    doCreateWallet,
    setupEmbeddedWalletIframe,
  });
}, {
  persist: {
    omit: ['isLoading'],
    debug: true,
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(privyStore, import.meta.hot));
}
