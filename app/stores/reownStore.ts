import { useAppKit } from "@reown/appkit/vue";
import { useAccount } from "@wagmi/vue";

export const reownStore = defineStore("reownStore", () => {
  const { open } = useAppKit();
  const account = useAccount();

  const connectWallet = async () => {
    if (account.status.value != 'connected') {
      await open({ view: 'Connect' })
    } else {
      await open({ view: 'Account' })
    }
  }

  return $$({
    connectWallet
  })
}, {
  persist: true,
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(reownStore, import.meta.hot));
}
