import { defineStore } from "pinia";
import { formatUnits, parseEther, parseUnits, erc20Abi } from "viem";
import {
  type SignTradeDataOptions,
  TYPEHASH_MERGE_SPLIT_ORDER,
  TYPEHASH_ORDER,
  TYPEHASH_PERMIT,
  TYPEHASH_REWARD,
  TYPEHASH_WITHDRAW,
} from "@/config/tradeTypes";
import { approveSign } from "@/api/userInfo";
import { market } from "@/config/abis";
import { shortenAddress } from "@/utils/processing";
import type { Web3Config } from "~/types";

export const walletStore = defineStore(
  "walletStore",
  () => {
    let walletConfig = $ref<Web3Config>();
    let userBalance = $ref<number>(0);
    let userCapital = $ref({
      total: 0,
      balance: 0,
      freez: 0,
      frozen: 0,
      position: 0,
    });

    const { walletClient: privyWalletClient, wallet } = $(privyStore());
    const { walletClient: lineWalletClient, address: lineAddress } = $(
      lineStore()
    );

    const walletClient = $computed(() => {
      return privyWalletClient
        ? privyWalletClient
        : lineWalletClient
        ? lineWalletClient
        : undefined;
    });

    const address = $computed(() => {
      return wallet ? wallet.address : lineAddress ? lineAddress : undefined;
    });

    const shortAddress = $computed(() => {
      return shortenAddress(wallet?.address || "", 4, 4);
    });

    // update web3 config by interface
    const updateWalletConfig = (data: Web3Config) => {
      walletConfig = data;
    };

    // transaction signature
    const signTradeData = async (options: SignTradeDataOptions) => {
      const { order } = options;
      try {
        const result = await walletClient.signTypedData({
          domain: getTypedDomain(),
          types: order.hasOwnProperty("side")
            ? TYPEHASH_ORDER
            : TYPEHASH_MERGE_SPLIT_ORDER,
          primaryType: order.hasOwnProperty("side") ? "Order" : "OrderSelf",
          message: order,
        });
        return result;
      } catch (err) {
        console.error("Error signing typed data:", err);
        throw err;
      }
    };

    /**
     * get wallet balance and update store
     */
    const updateWalletBalance = useDebounceFn(async () => {
      if (!address) return;

      // Obtain USDT balance
      let res = await walletClient.readContract({
        address: walletConfig!.main.address,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [address],
      });
      if (res != userBalance) {
        console.log(`usdt Balance: ${userBalance} → ${res}`);
        userBalance = Number(formatUnits(res, 6)) || 0;
        userCapital.total = userBalance + userCapital.position;
      }
    }, 2000);

    /**
     * Query the user's token authorization
     */
    const queryAllowance = async (coinType: any) => {
      const coinInfo = coinType == 0 ? walletConfig!.main : walletConfig!.meme;
      const result = await walletClient.readContract({
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
        const result = await walletClient.signTypedData({
          domain: getTypedDomain(),
          types: TYPEHASH_PERMIT,
          primaryType: "Permit",
          message: message,
        });
        return result;
      } catch (err) {
        console.error("Error signing typed data:", err);
        throw err;
      }
    };

    /**
     * Inquiry on user token authorization and initiate authorization
     */
    const queryAllowanceAndPermit = async (
      coinType: any,
      allowanceAmount: string
    ) => {
      try {
        const coinInfo =
          coinType == 0 ? walletConfig!.main : walletConfig!.meme;

        const allowanced = await queryAllowance(coinType);
        const minValue = parseUnits(allowanceAmount, coinType == 0 ? 6 : 18);
        // If the authorization is insufficient, a signature is required
        if (allowanced < minValue) {
          // If the authorization is insufficient, a signature is required
          const nonce = (await walletClient.readContract({
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
          if (res) return true;
        } else {
          return true; // Authorization is sufficient, no need to sign
        }
      } catch (err) {
        console.error("Error querying allowance and permit:", err);
      }
      return false;
    };

    const amountPermit = async () => {
      try {
        const allowanceAmount = parseEther("1").toString();
        await queryAllowanceAndPermit(0, allowanceAmount);
        // await queryAllowanceAndPermit(1, allowanceAmount);
      } catch (err) {
        console.error("Error amount permit:", err);
      }
    };

    const signWithdraw = async (message: any) => {
      try {
        const result = await walletClient.signTypedData({
          domain: getTypedDomain(),
          types: TYPEHASH_WITHDRAW,
          primaryType: "Withdraw",
          message: message,
        });
        return result;
      } catch (err) {
        console.error("Error signing typed data:", err);
        throw err;
      }
    };

    /**
     * Sign the payout
     */
    const signPayout = async (message: any) => {
      try {
        const result = await walletClient.signTypedData({
          domain: getTypedDomain(),
          types: TYPEHASH_REWARD,
          primaryType: "Reward",
          message: message,
        });
        return result;
      } catch (err) {
        console.error("Error signing typed data:", err);
        throw err;
      }
    };

    const getTypedDomain = () => {
      return {
        name: walletConfig!.contract.name,
        version: walletConfig!.contract.version.toString(),
        chainId: walletConfig!.chain.id,
        verifyingContract: walletConfig!.contract.address,
      } as const;
    };

    return $$({
      walletConfig,
      userBalance,
      userCapital,
      walletClient,
      address,
      shortAddress,
      signWithdraw,
      updateWalletBalance,
      signTradeData,
      updateWalletConfig,
      queryAllowanceAndPermit,
      amountPermit,
      signPayout,
    });
  },
  {
    // @ts-ignore
    persist: {
      debug: true
    },
  }
);

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(walletStore, import.meta.hot));
}
