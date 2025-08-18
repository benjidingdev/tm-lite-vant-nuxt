import { defineStore } from "pinia";
import { useAccount, useSignMessage, useSignTypedData } from "@wagmi/vue";
import { useAppKit } from "@reown/appkit/vue";
import { avalancheFuji } from "viem/chains";
import { createSiweMessage } from "viem/siwe";
import { getBalance, readContract } from "@wagmi/core";
import {
  createWalletClient,
  http,
  formatUnits,
  getAddress,
  parseUnits,
} from "viem";
import type { EIP1193Provider } from "viem";
import { TYPEHASH_PERMIT, TYPEHASH_ORDER } from "@/types/sign";
import type { SignTradeDataOptions } from "@/types/sign";
import type { SiweMessage } from "@/types";
import {
  TYPEHASH_DOMAIN,
  TYPEHASH_MERGE_SPLIT_ORDER,
} from "@/config/tradeTypes";

import * as walletApi from "~/api/wallet";
import { approveSign } from "@/api/userInfo";
import { market } from "@/config/abis";
import { shortenAddress } from "@/utils/processing";

type contentType = {
  domain: typeof TYPEHASH_DOMAIN;
  types: typeof TYPEHASH_ORDER | typeof TYPEHASH_MERGE_SPLIT_ORDER;
  primaryType: "Order" | "OrderSelf";
  message: any;
};

export const useWalletStore = defineStore("walletStore", () => {
  const { afterLoginSuccess, logOut } = $(authStore());
  const { isToken } = $(coreStore());
  // const { createPimlicoClientInstance, smartAccountClient } = $(pimlicoStore());
  let walletConected = $ref<boolean>(false);
  let msg = $ref("");
  let nonce = $ref("");
  let walletConfig = $ref({});
  let walletClient = $ref(null);
  let isSign = $ref<boolean>(false); // Whether to sign successfully
  let usdtBalance = $ref<bigint | null>(null); // USDT balance
  let tokenBalance = $ref<bigint>(); // TUIT balance
  let userBalance = $ref(0);

  const { $wagmiAdapter } = useNuxtApp();
  const { open } = useAppKit();
  const { isConnected, address, chainId } = $(useAccount());
  const { signMessageAsync } = useSignMessage();
  const { signTypedDataAsync } = useSignTypedData();

  const userCapital = $ref({
    total: 0,
    balance: 0,
    freez: 0,
    frozen: 0,
    position: 0,
  });

  let walletAddress = $computed(() => {
    return shortenAddress(address || "", 4, 4);
  });

  const initWalletClient = () => {
    walletClient = createWalletClient({
      account: walletAddress,
      transport: http(avalancheFuji.rpcUrls.default.http[0]),
    });
  };

  const setWalletConnected = (connected: boolean) => {
    walletConected = connected;
  };

  const updateWalletConfig = (data: any) => {
    walletConfig = data;
  };

  // refresh sign status
  const updateSign = (sign: boolean) => {
    isSign = sign;
  };

  const updateUserBalance = (balance: number) => {
    userBalance = balance || 0;
    userCapital.total = userBalance + userCapital.position;
  };

  const updateTokenBalance = (balance: number) => {
    tokenBalance = balance || 0;
  };

  /**
   * Sign in, after the user connects the wallet, call the backend service to get the message
   * Then request the signature, get the signature string, and call the backend interface to verify the signature
   */
  const signLoginMessage = async (nonce: string) => {
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

    console.log("signLoginMessage message:", message);

    try {
      let res = await signMessageAsync(
        {
          account: address,
          message: message,
        },
        {
          onSuccess: (data: any, variables: any, context: any) => {
            isSign = true;
            return data;
          },
          onError: (error: any, variables: any, context: any) => {
            isSign = false;
            isToken(false);
            throw error;
          },
        }
      );
      return { message: messageObj, signature: res };
    } catch (err) {
      console.error("Error signing message:", err);
      isSign = false; // Ensure isSign is false when signing fails
      isToken(false);
      console.error("Signing failed:", err);
      throw err;
    }
  };

  /**
   * Connect wallet
   */
  const connectWallet = async () => {
    if (!isConnected) {
      await logOut();
      open({ view: "Connect", namespace: "eip155" });
    } else {
      if (isConnected) {
        todoSign();
      } else {
        open({ view: "Connect", namespace: "eip155" });
      }
    }
  };

  /**
   * Sign in
   * @returns
   */
  const todoSign = async () => {
    if (isSign) return;
    try {
      isSign = true;
      if (address) {
        console.log("todoSign address:", address);
        const nonceRes = await getNonce(address);
        if (nonceRes) {
          const signData = await signLoginMessage(nonceRes.data);
          console.log("the last step before loggin", signData);
          await todoLogin(signData);
        }
      }
    } catch (error) {
      console.log("todoSign error", error);
    } finally {
      isSign = false;
    }
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
      const result = await signTypedDataAsync(content);
      console.log("result:", result);

      return result;
    } catch (err) {
      console.error("Error signing typed data:", err);
      throw err;
    }
  };

  // get signature message
  const getNonce = async (_address: any) => {
    try {
      let res: any = await walletApi.getNonce({ proxyWallet: _address });
      return res;
    } catch (error) {
      throw error;
    }
  };

  // start login process
  const todoLogin = async (data: {
    message: SiweMessage;
    signature: string;
  }) => {
    let inviteCode = localStorage.getItem("inviteCode") || "";
    let result = await walletApi.loginByWallet({
      proxyWallet: address,
      ivcode: inviteCode,
      signature: data.signature,
      message: data.message,
    });
    if (result && result?.code === 0) {
      console.log("login success");
      afterLoginSuccess(result);
      // Update wallet balance
      updateWalletBalance();
    } else {
      console.error("Login failed:");
    }
  };

  /**
   * get wallet balance and update store
   */
  const updateWalletBalance = async () => {
    console.log("params", {
      chainId: chainId,
      address: address as any,
      token: walletConfig.main.address,
    });
    if (!address) return;
    // get USDT balance
    const mainRes = await getBalance($wagmiAdapter.wagmiConfig, {
      chainId: chainId,
      address: address as any,
      token: walletConfig!.main.address,
    });
    if (mainRes.value != usdtBalance) {
      updateUserBalance(Number(formatUnits(mainRes.value, mainRes.decimals)));
      console.log("mainRes", mainRes);
      usdtBalance = mainRes.value;
    }
    // get MEME balance
    const memeRes = await getBalance($wagmiAdapter.wagmiConfig, {
      chainId: chainId,
      address: address as any,
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
      args: [address.value, walletConfig!.contract.address],
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
        chainId: parseUnits(chainId.toString(), 0),
        verifyingContract: coinInfo.address,
      };
      const result = await signTypedDataAsync({
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
      //console.log('user allowance amount:', allowanced, "request allowance amount:", minValue)

      // If the authorization is insufficient, a signature is required
      if (allowanced < minValue) {
        // If the authorization is insufficient, a signature is required
        const nonce = (await readContract(config, {
          abi: market,
          address: coinInfo.address,
          args: [address],
          functionName: "nonces",
        })) as bigint;
        // Query nonce first
        const param = {
          owner: address,
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
          owner: address,
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

  watch(
    () => isConnected,
    async (isConnected: boolean) => {
      setWalletConnected(isConnected);
      if (isConnected) {
        let vConsole = new window.VConsole();
        initWalletClient();
        // await createPimlicoClientInstance();
        todoSign();
      } else {
        logOut();
      }
    },
    { immediate: true }
  );

  return $$({
    walletAddress,
    walletConected,
    walletConfig,
    nonce,
    walletClient,
    msg,
    getNonce,
    todoSign,
    updateSign,
    signTradeData,
    connectWallet,
    updateWalletConfig,
    queryAllowanceAndPermit,
    updateUserBalance,
    userBalance,
    userCapital,
    tokenBalance,
    updateTokenBalance,
  });
});
