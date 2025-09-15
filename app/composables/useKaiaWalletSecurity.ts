import { useQuery } from "@tanstack/vue-query";
import { useKaiaWalletStore } from "~/stores/kaiaWalletStore";
import { liff } from "~/utils/liff";

export const useKaiaWalletSecurity = () => {
  const kaiaWallet = useKaiaWalletStore();
  const config = useRuntimeConfig();

  return useQuery({
    queryKey: ["kaia", "sdk"],
    queryFn: async () => {
      // initialize LIFF
      const liffId = config.public?.liffId as string;
      if (liffId) {
        await liff.init({ liffId });
      }

      // initialize SDK
      const sdk = await kaiaWallet.initialize();
      return sdk;
    },
    retry: false,
    throwOnError: true,
  });
};
