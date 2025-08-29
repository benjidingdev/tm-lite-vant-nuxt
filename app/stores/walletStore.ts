import { defineStore } from "pinia";
import type { EIP1193Provider } from "viem";
import { formatUnits, parseEther, parseUnits } from "viem";
import { getBalance, readContract, writeContract } from "@wagmi/core";
import { useAccount, useAccountEffect } from "@wagmi/vue";
import { useAppKit, useAppKitNetwork } from "@reown/appkit/vue";

import {
  TYPEHASH_DOMAIN,
  TYPEHASH_MERGE_SPLIT_ORDER,
} from "@/config/tradeTypes";
import {
  TYPEHASH_PERMIT,
  TYPEHASH_ORDER,
  TYPEHASH_WITHDRAW,
} from "@/types/sign";
import type { SignTradeDataOptions } from "@/types/sign";
import { approveSign } from "@/api/userInfo";
import { market, usdtAbi } from "@/config/abis";
import { shortenAddress } from "@/utils/processing";
import { getNetworks, getUsdcAddress, getDomain, getTokenMessager, getMessageTransmitter } from "@/config/networks"

type contentType = {
  domain: typeof TYPEHASH_DOMAIN;
  types: typeof TYPEHASH_ORDER | typeof TYPEHASH_MERGE_SPLIT_ORDER;
  primaryType: "Order" | "OrderSelf";
  message: any;
};

export const walletStore = defineStore("walletStore", () => {
  let walletConected = $ref<boolean>(false);
  let walletConfig = $ref({});
  let usdtBalance = $ref<bigint | null>(null); // USDT balance
  let tokenBalance = $ref<bigint>(); // TUIT balance
  let userBalance = $ref(0);
  let usdcBalance = $ref(0);
  let selfBalance = $ref(0);

  const { $wagmiAdapter } = useNuxtApp();
  const networks = getNetworks(useRuntimeConfig().public.testnet as boolean)

  const { open } = useAppKit();
  const account = useAccount();
  const networkData = useAppKitNetwork();

  const userCapital = $ref({
    total: 0,
    balance: 0,
    freez: 0,
    frozen: 0,
    position: 0,
  });

  const { walletClient, publicClient, wallet } = $(privyStore());

  let loginAddress = $computed(() => {
    return wallet?.address;
  })
  let shortWalletAddress = $computed(() => {
    return shortenAddress(wallet?.address || "", 4, 4);
  });

  useAccountEffect({
    config: $wagmiAdapter.wagmiConfig,
    onConnect(data: any) {
      console.log("Wallet connected:", data);
      walletConected = true;
      getSelfBalance();
    },
    onDisconnect() {
      console.log("Wallet disconnected");
      walletConected = false;
      selfBalance = 0;
    },
  });

  const connectWallet = async () => {
    if (account.status.value != 'connected') {
      await open({ view: 'Connect' })
    } else {
      await open({ view: 'Account' })
    }
  }

  const switchNetwork = async (networkName: string) => {
    const network = $wagmiAdapter.wagmiChains!.find((chain) => chain.name === networkName);
    if (network) {
      networkData.value.switchNetwork(network);
    }
  }

  const getSelfBalance = async () => {
    if (account.status.value != 'connected') return;
    const usdcAddress = getUsdcAddress(account.chain.value!)
    // get USDT balance
    const mainRes = await getBalance($wagmiAdapter.wagmiConfig, {
      chainId: account.chainId.value,
      address: account.address.value as `0x${string}`,
      token: usdcAddress
    });
    selfBalance = Number(formatUnits(mainRes.value, mainRes.decimals));
  }

  const getSelfAllowance = async () => {
    if (account.status.value != 'connected') return;
    const usdcAddress = getUsdcAddress(account.chain.value!)
    const tokenMessager = getTokenMessager(account.chain.value!)
    const result = await readContract($wagmiAdapter.wagmiConfig, {
      abi: usdtAbi,
      address: usdcAddress,
      args: [account.address.value, tokenMessager],
      functionName: 'allowance'
    })
    return Number(formatUnits(result as bigint, 6))
  }

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
    const { order } = options;
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
    // get USDT balance
    const mainRes = await getBalance($wagmiAdapter.wagmiConfig, {
      chainId: walletConfig.chain.id,
      address: wallet.address as any,
      token: walletConfig!.main.address,
    });
    if (mainRes.value != usdtBalance) {
      console.log("mainRes", mainRes);
      updateUserBalance(Number(formatUnits(mainRes.value, mainRes.decimals)));
      usdtBalance = Number(formatUnits(mainRes.value, mainRes.decimals));
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
      tokenBalance = Number(formatUnits(memeRes.value, memeRes.decimals));
    }
    // get USDC balance
    const usdcAddress = getUsdcAddress(walletClient.chain!)
    const usdcRes = await getBalance($wagmiAdapter.wagmiConfig, {
      chainId: walletConfig.chain.id,
      address: wallet.address as any,
      token: usdcAddress,
    });
    if (usdcRes.value != usdcBalance) {
      console.log("usdcRes", usdcRes);
      usdcBalance = Number(formatUnits(usdcRes.value, usdcRes.decimals));
    }
  };

  /**
   * Query the user's token authorization
   * @param coinType
   * @returns
   */
  const queryAllowance = async (coinType: any) => {
    const coinInfo = coinType == 0 ? walletConfig!.main : walletConfig!.meme;
    const result = await publicClient.readContract({
      abi: market,
      address: coinInfo.address,
      args: [wallet.address, walletConfig!.contract.address],
      functionName: "allowance",
    });
    return result as bigint;
  };

  /**
    * Signature authorization
    */
  const approveUSDC = async (amount: number) => {
    try {
      const usdcAddress = getUsdcAddress(account.chain.value!)
      const tokenMessager = getTokenMessager(account.chain.value!)

      const tx = await writeContract($wagmiAdapter.wagmiConfig, {
        abi: usdtAbi,
        address: usdcAddress,
        args: [
          tokenMessager,
          parseUnits(amount.toString(), 6)
        ],
        functionName: 'approve'
      })
      console.log('approve usdc result', tx)
      return tx
    } catch (err) {
      console.error("Error signing approve:", err)
      return undefined
    }
  }

  /**
    *
    */
  const burnUSDC = async (amount: number) => {
    try {
      const network = account.chain.value!
      const usdcAddress = getUsdcAddress(network)
      const tokenMessager = getTokenMessager(network)
      const originDomain = getDomain(network)
      const destinationDomain = getDomain(walletClient.chain!)
      const destinationAddress_bytes32 = `0x000000000000000000000000${wallet.address!.slice(2)}`
      const destinationCaller_bytes32 = "0x0000000000000000000000000000000000000000000000000000000000000000";

      const tx = await writeContract($wagmiAdapter.wagmiConfig, {
        abi: usdtAbi,
        address: tokenMessager,
        args: [
          parseUnits(amount.toString(), 6),
          destinationDomain,
          destinationAddress_bytes32,
          usdcAddress,
          destinationCaller_bytes32,
          500n, // Set fast transfer max fee in 10^6 subunits (0.0005 USDC; change as needed)
          1000 // minFinalityThreshold (1000 or less for Fast Transfer)
        ],
        functionName: 'depositForBurn'
      })
      console.log(`burn usdc from domain: ${destinationDomain} and return transactionHash: ${tx}`)
      return { originDomain: originDomain, destinationDomain: destinationDomain, transactionHash: tx }
    } catch (err) {
      console.error("Error signing approve:", err)
      return undefined
    }
  }

  /**
   *
   */
  const mintUSDC = async (attestation: any) => {
    try {
      const messageTransmitter = getMessageTransmitter(account.chain.value!)

      const tx = await walletClient.writeContract({
        abi: usdtAbi,
        address: messageTransmitter,
        args: [
          attestation.message,
          attestation.attestation
        ],
        functionName: 'receiveMessage'
      })
      console.log(`receive message: ${attestation} and mint usdc: ${tx}`)
      return tx
    } catch (err) {
      console.error("Error signing approve:", err)
      return undefined
    }
  }

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
    allowanceAmount: string
  ) => {
    try {
      const coinInfo = coinType == 0 ? walletConfig!.main : walletConfig!.meme;

      const allowanced = await queryAllowance(coinType);
      const minValue = parseUnits(
        allowanceAmount,
        coinType == 0 ? 6 : 18
      );

      // If the authorization is insufficient, a signature is required
      if (allowanced < minValue) {
        // If the authorization is insufficient, a signature is required
        const nonce = (await publicClient.readContract({
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

  const signWithdraw = async (params: any) => {
    try {
      const typeDomain = {
        name: walletConfig.contract.name,
        version: walletConfig.contract.version.toString(),
        chainId: walletConfig.chain.id,
        verifyingContract: walletConfig.contract.address,
      } as const;
      // signature trade data
      const content = {
        domain: typeDomain,
        types: TYPEHASH_WITHDRAW,
        primaryType: "Withdraw",
        message: params,
      };
      const result = await walletClient.signTypedData(content);
      console.log("result:", result, "typeDomain:", typeDomain);
    } catch (err) {
      console.error("Error signing typed data:", err);
      throw err;
    }
  };

  const amountPermit = async () => {
    try {
      const allowanceAmount = parseEther('1').toString();
      await queryAllowanceAndPermit(0, allowanceAmount);
      await queryAllowanceAndPermit(1, allowanceAmount);
    } catch (err) {
      console.error("Error amount permit:", err);
    }
  }

  return $$({
    networks,
    loginAddress,
    shortWalletAddress,
    walletConected,
    walletConfig,
    wallet,
    walletClient,
    account,
    userBalance,
    userCapital,
    tokenBalance,
    usdcBalance,
    selfBalance,
    connectWallet,
    switchNetwork,
    getSelfAllowance,
    signWithdraw,
    updateWalletBalance,
    signTradeData,
    updateWalletConfig,
    approveUSDC,
    burnUSDC,
    mintUSDC,
    queryAllowanceAndPermit,
    updateUserBalance,
    updateTokenBalance,
    amountPermit,
  });
}, {
  persist: true,
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(walletStore, import.meta.hot));
}
