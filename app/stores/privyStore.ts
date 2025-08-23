export const privyStore = defineStore("privyStore", () => {
  const { $privy } = useNuxtApp();

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
    wallet = await $privy.embeddedWallet.create({});
    console.log('wallet', wallet)
    isLoading = false
  }

  const userEmail = $computed(() => {
    return session?.user?.linked_accounts?.find(item => item.type === 'email')?.address || ''
  })

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
