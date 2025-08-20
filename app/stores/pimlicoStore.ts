import { toSafeSmartAccount } from "permissionless/accounts";
import { createPublicClient, getContract, http, parseUnits } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { sepolia, baseSepolia, avalancheFuji } from "viem/chains";
import { createPimlicoClient } from "permissionless/clients/pimlico";
import { entryPoint07Address } from "viem/account-abstraction";
import { createSmartAccountClient } from "permissionless";
import { useAccount, useSignMessage, useSignTypedData } from "@wagmi/vue";

export const pimlicoStore = defineStore("pimlicoStore", () => {
  const { shortWalletAddress } = $(walletStore());
  let smartAccountClient = $ref(null);

  
  const publicClient = createPublicClient({
    chain: avalancheFuji,
    transport: http(avalancheFuji.rpcUrls.default.http[0]),
  });

  // pimlico API key
  const apiKey = process.env.PIMLICO_API_KEY || "pim_WX9HsnPeACSnqsoJxtPCvA";

  if (!apiKey) throw new Error("Missing PIMLICO_API_KEY");

  // private key
  const privateKey = process.env.P_KEY || generatePrivateKey();

  const account = useAccount();
  const createPimlicoClientInstance = async () => {

    const pimlicoUrl = `https://api.pimlico.io/v2/${avalancheFuji.id}/rpc?apikey=${apiKey}`;
    const pimlicoClient = createPimlicoClient({
      transport: http(pimlicoUrl),
      entryPoint: {
        address: entryPoint07Address,
        version: "0.7",
      },
    });
    const ssAccount = await toSafeSmartAccount({
      client: publicClient,
      // owners: [account],
      owners: [privateKeyToAccount(privateKey)],
      address: shortWalletAddress,
      entryPoint: {
        address: entryPoint07Address,
        version: "0.7",
      }, // global entrypoint
      version: "1.4.1",
    });

    smartAccountClient = createSmartAccountClient({
      account: ssAccount,
      chain: avalancheFuji,
      bundlerTransport: http(pimlicoUrl),
      paymaster: pimlicoClient,
      userOperation: {
        estimateFeesPerGas: async () => {
          return (await pimlicoClient.getUserOperationGasPrice()).fast;
        },
      },
    });
  };

  return $$({
    createPimlicoClientInstance,
    smartAccountClient,
  });
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(pimlicoStore, import.meta.hot));
}

// pimlico provides two kinds of paymaster to absctract away gas fees for your users:
// 1. verified paymaster
// 2. erc-20 paymaster


