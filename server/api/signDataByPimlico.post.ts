import "dotenv/config";
import { writeFileSync } from "fs";
import { toSafeSmartAccount } from "permissionless/accounts";
import { Hex, createPublicClient, getContract, http, parseUnits } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { sepolia, baseSepolia, avalancheFuji } from "viem/chains";
import { createPimlicoClient } from "permissionless/clients/pimlico";
import {
  entryPoint07Address,
} from "viem/account-abstraction";
import { createSmartAccountClient } from "permissionless";


export default defineEventHandler(async (event) => {
  console.log("Starting PIMLICO transaction...");
  const content = await readBody(event);

  // pimlico API key
  const apiKey = process.env.PIMLICO_API_KEY || "pim_WX9HsnPeACSnqsoJxtPCvA";

  if (!apiKey) throw new Error("Missing PIMLICO_API_KEY");

  // private key
  const privateKey = (process.env.P_KEY as Hex) || generatePrivateKey();

  const publicClient = createPublicClient({
    chain: avalancheFuji,
    transport: http(avalancheFuji.rpcUrls.default.http[0]),
  });

  const pimlicoUrl = `https://api.pimlico.io/v2/${avalancheFuji.id}/rpc?apikey=${apiKey}`;

  const pimlicoClient = createPimlicoClient({
    transport: http(pimlicoUrl),
    entryPoint: {
      address: entryPoint07Address,
      version: "0.7",
    },
  });

  console.log(pimlicoClient, "pimlicoClient");

  const account = await toSafeSmartAccount({
    client: publicClient,
    owners: [privateKeyToAccount(privateKey)],
    entryPoint: {
      address: entryPoint07Address,
      version: "0.7",
    }, // global entrypoint
    version: "1.4.1",
  });

  const smartAccountClient = createSmartAccountClient({
    account,
    chain: avalancheFuji,
    bundlerTransport: http(pimlicoUrl),
    paymaster: pimlicoClient,
    userOperation: {
      estimateFeesPerGas: async () => {
        return (await pimlicoClient.getUserOperationGasPrice()).fast;
      },
    },
  });

  content.message.slippageBps = parseUnits(content.message.slippageBps + "", 4);
  content.message.tokenAmount = parseUnits(content.message.tokenAmount + "", 6);
  content.message.tokenPriceInPaymentToken = parseUnits(
    content.message.tokenPriceInPaymentToken + "",
    6
  );
  const result = await smartAccountClient.signTypedData(content);
  return { code: 0, data: result };
});
