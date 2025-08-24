import { defineStore } from "pinia";
import { avalancheFuji } from "viem/chains";
import type { EIP1193Provider } from "viem";
import {
  formatUnits,
  parseUnits,
} from "viem";
import { useAccount } from "@wagmi/vue";
import { getBalance, readContract } from "@wagmi/core";

import {
  TYPEHASH_DOMAIN,
  TYPEHASH_MERGE_SPLIT_ORDER,
} from "@/config/tradeTypes";
import { TYPEHASH_PERMIT, TYPEHASH_ORDER } from "@/types/sign";
import type { SignTradeDataOptions } from "@/types/sign";
import { approveSign } from "@/api/userInfo";
import { market } from "@/config/abis";
import { shortenAddress } from "@/utils/processing";

type contentType = {
  domain: typeof TYPEHASH_DOMAIN;
  types: typeof TYPEHASH_ORDER | typeof TYPEHASH_MERGE_SPLIT_ORDER;
  primaryType: "Order" | "OrderSelf";
  message: any;
};

export const walletStore = defineStore("walletStore", () => {
  let walletConected = $ref<boolean>(false);
  let msg = $ref("");
  let nonce = $ref("");
  let walletConfig = $ref({});
  let usdtBalance = $ref<bigint | null>(null); // USDT balance
  let tokenBalance = $ref<bigint>(); // TUIT balance
  let userBalance = $ref(0);
  let account = $ref(null);

  const { $wagmiAdapter } = useNuxtApp();
  const { isConnected } = $(useAccount());

  const userCapital = $ref({
    total: 0,
    balance: 0,
    freez: 0,
    frozen: 0,
    position: 0,
  });

  const { walletClient, wallet } = $(privyStore())

  let shortWalletAddress = $computed(() => {
    return shortenAddress(wallet?.address || "", 4, 4);
  });

  const updateWalletConfig = (data: any) => {
    walletConfig = data;
  };

  const updateUserBalance = (balance: number) => {
    userBalance = balance || 0;
    userCapital.total = userBalance + userCapital.position;
  };

  const updateTokenBalance = (balance: number) => {
    tokenBalance = balance || 0;
  };

  // transcation signature
  const signTradeData = async (options: SignTradeDataOptions) => {
    const { domain, types, order } = options;
    try {
      const typeDomain = {
        name: walletConfig.contract.name,
        version: walletConfig.contract.version.toString(),
        chainId: walletConfig.chain.id,
        verifyingContract: walletConfig.contract.address,
      } as const;
      // signature trade data
      const content: contentType = {
        domain: typeDomain,
        types: order.hasOwnProperty("side")
          ? TYPEHASH_ORDER
          : TYPEHASH_MERGE_SPLIT_ORDER,
        primaryType: order.hasOwnProperty("side") ? "Order" : "OrderSelf",
        message: order,
      };
      // signature returned result
      const result = await walletClient.signTypedData(content);
      console.log("result:", result);

      return result;
    } catch (err) {
      console.error("Error signing typed data:", err);
      throw err;
    }
  };

  /**
   * get wallet balance and update store
   */
  const updateWalletBalance = async () => {
    if (!wallet.address) return;
    console.log("params", {
      chainId: walletConfig.chain.id,
      address: wallet.address as any,
      token: walletConfig.main.address,
    });
    // get USDT balance
    const mainRes = await getBalance($wagmiAdapter.wagmiConfig, {
      chainId: walletConfig.chain.id,
      address: wallet.address as any,
      token: walletConfig!.main.address,
    });
    if (mainRes.value != usdtBalance) {
      console.log("mainRes", mainRes);
      updateUserBalance(Number(formatUnits(mainRes.value, mainRes.decimals)));
      usdtBalance = mainRes.value;
    }
    // get MEME balance
    const memeRes = await getBalance($wagmiAdapter.wagmiConfig, {
      chainId: walletConfig.chain.id,
      address: wallet.address as any,
      token: walletConfig!.meme.address,
    });
    if (memeRes.value != tokenBalance) {
      console.log(`token balance change: ${tokenBalance} → ${memeRes.value}`);
      updateTokenBalance(Number(formatUnits(memeRes.value, memeRes.decimals)));
      tokenBalance = memeRes.value;
    }
  };

  async function ensureWalletUnlocked() {
    const provider = window.ethereum as EIP1193Provider;
    if (!provider) throw new Error("MetaMask is not installed");
  }
  /**
   * Query the user's token authorization
   * @param coinType
   * @returns
   */
  const queryAllowance = async (coinType: any) => {
    const config = $wagmiAdapter.wagmiConfig;
    const coinInfo = coinType == 0 ? walletConfig!.main : walletConfig!.meme;
    const result = await readContract(config, {
      abi: market,
      address: coinInfo.address,
      args: [wallet.address, walletConfig!.contract.address],
      functionName: "allowance",
    });
    return result as bigint;
  };

  /**
   * Sign the permit
   */
  const signPermit = async (coinInfo: any, message: any) => {
    try {
      const typeDomain = {
        name: coinInfo.name,
        version: coinInfo.version.toString(),
        chainId: parseUnits(walletConfig.chain.id.toString(), 0),
        verifyingContract: coinInfo.address,
      };
      const result = await walletClient.signTypedData({
        domain: typeDomain,
        types: TYPEHASH_PERMIT,
        primaryType: "Permit",
        message: message,
      });
      console.log("content:", message, "typeDomain:", typeDomain);
      return result;
    } catch (err) {
      console.error("Error signing typed data:", err);
      throw err;
    }
  };

  /**
   * Inquiry on user token authorization and initiate authorization
   * @param coinType
   * @param allowanceAmount
   * @returns
   */
  const queryAllowanceAndPermit = async (
    coinType: any,
    allowanceAmount: number
  ) => {
    try {
      await ensureWalletUnlocked();

      const config = $wagmiAdapter.wagmiConfig;
      const coinInfo = coinType == 0 ? walletConfig!.main : walletConfig!.meme;

      const allowanced = await queryAllowance(coinType);
      const minValue = parseUnits(
        allowanceAmount.toString(),
        coinType == 0 ? 6 : 18
      );

      // If the authorization is insufficient, a signature is required
      if (allowanced < minValue) {
        // If the authorization is insufficient, a signature is required
        const nonce = (await readContract(config, {
          abi: market,
          address: coinInfo.address,
          args: [wallet.address],
          functionName: "nonces",
        })) as bigint;
        // Query nonce first
        const param = {
          owner: wallet.address,
          spender: walletConfig!.contract.address,
          value: minValue,
          nonce: nonce,
          deadline: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365 * 100,
        };
        const permitSig = await signPermit(coinInfo, param);
        if (!permitSig) return false;

        // Initiate authorization
        const approveParam = {
          value: formatUnits(param.value, coinType == 0 ? 6 : 18),
          nonce: formatUnits(param.nonce, 0),
          type: coinType,
          sign: permitSig,
          deadline: param.deadline,
          owner: wallet.address,
          spender: walletConfig!.contract.address,
        };
        const res = await approveSign(approveParam);
        console.log("allowance success:", res);
        if (res) return true;
      } else {
        return true; // Authorization is sufficient, no need to sign
      }
    } catch (err) {
      console.error("Error querying allowance and permit:", err);
    }
    return false;
  };

  return $$({
    shortWalletAddress,
    walletConected,
    walletConfig,
    wallet,
    nonce,
    walletClient,
    msg,
    account,
    userBalance,
    userCapital,
    tokenBalance,
    updateWalletBalance,
    signTradeData,
    // connectWallet,
    updateWalletConfig,
    queryAllowanceAndPermit,
    updateUserBalance,
    updateTokenBalance,
  });
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(walletStore, import.meta.hot));
}
