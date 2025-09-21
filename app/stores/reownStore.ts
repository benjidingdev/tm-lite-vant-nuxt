import { useAppKit } from "@reown/appkit/vue";
import { formatUnits, parseUnits } from "viem";
import { useAccount, useAccountEffect } from "@wagmi/vue";
import {
  getBalance,
  readContract,
  writeContract,
  switchChain,
} from "@wagmi/core";
import {
  getUsdcAddress,
  getDomain,
  getTokenMessager,
  getMessageTransmitter,
} from "@/config/networks";
import { usdtAbi } from "@/config/abis";

export const reownStore = defineStore(
  "reownStore",
  () => {
    let walletConected = $ref<boolean>(false);
    let selfBalance = $ref(0);

    const { open } = useAppKit();
    const account = useAccount();
    const { $wagmiAdapter } = useNuxtApp();
    const { walletClient, address } = $(walletStore())

    useAccountEffect({
      config: $wagmiAdapter.wagmiConfig,
      onConnect(data: any) {
        walletConected = true;
        getSelfBalance();
      },
      onDisconnect() {
        walletConected = false;
        selfBalance = 0;
      },
    });

    const connectWallet = async () => {
      if (account.status.value != "connected") {
        await open({ view: "Connect" });
      } else {
        await open({ view: "Account" });
      }
    };

    const switchNetwork = async (networkName: string) => {
      const network = $wagmiAdapter.wagmiChains!.find(
        (chain) => chain.name === networkName
      );
      if (network) {
        await switchChain($wagmiAdapter.wagmiConfig, { chainId: network.id });
      }
    };

    let isGetSelfBalanceLoading = $ref(false);
    const getSelfBalance = async () => {
      if (account.status.value != "connected" || isGetSelfBalanceLoading)
        return;
      isGetSelfBalanceLoading = true;
      const usdcAddress = getUsdcAddress(account.chain.value!);
      // Get USDT balance
      const mainRes = await getBalance($wagmiAdapter.wagmiConfig, {
        chainId: account.chainId.value,
        address: account.address.value as `0x${string}`,
        token: usdcAddress,
      });
      selfBalance = Number(formatUnits(mainRes.value, mainRes.decimals));
      isGetSelfBalanceLoading = false;
    };

    const getSelfAllowance = async () => {
      if (account.status.value != "connected") return;
      const usdcAddress = getUsdcAddress(account.chain.value!);
      const tokenMessager = getTokenMessager(account.chain.value!);
      const result = await readContract($wagmiAdapter.wagmiConfig, {
        abi: usdtAbi,
        address: usdcAddress,
        args: [account.address.value, tokenMessager],
        functionName: "allowance",
      });
      return Number(formatUnits(result as bigint, 6));
    };

    /**
     * Signature authorization
     */
    const approveUSDC = async (amount: number) => {
      try {
        const usdcAddress = getUsdcAddress(account.chain.value!);
        const tokenMessager = getTokenMessager(account.chain.value!);

        const tx = await writeContract($wagmiAdapter.wagmiConfig, {
          abi: usdtAbi,
          address: usdcAddress,
          args: [tokenMessager, parseUnits(amount.toString(), 6)],
          functionName: "approve",
        });
        return tx;
      } catch (err: any) {
        console.error("Error signing approve:", err);
        return {
          error: err.shortMessage,
        };
      }
    };

    const burnUSDC = async (amount: number) => {
      try {
        const network = account.chain.value!;
        const usdcAddress = getUsdcAddress(network);
        const tokenMessager = getTokenMessager(network);
        const originDomain = getDomain(network);
        const destinationDomain = getDomain(walletClient.chain!);
        const destinationAddress_bytes32 = `0x000000000000000000000000${address!.slice(
          2
        )}`;
        const destinationCaller_bytes32 =
          "0x0000000000000000000000000000000000000000000000000000000000000000";
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
            1000, // minFinalityThreshold (1000 or less for Fast Transfer)
          ],
          functionName: "depositForBurn",
        });
        return {
          originDomain: originDomain,
          destinationDomain: destinationDomain,
          transactionHash: tx,
        };
      } catch (err) {
        console.error("Error signing approve:", err);
        return undefined;
      }
    };

    const mintUSDC = async (attestation: any) => {
      try {
        const messageTransmitter = getMessageTransmitter(account.chain.value!);

        const tx = await walletClient.writeContract({
          abi: usdtAbi,
          address: messageTransmitter,
          args: [attestation.message, attestation.attestation],
          functionName: "receiveMessage",
        });
        return tx;
      } catch (err) {
        console.error("Error signing approve:", err);
        return undefined;
      }
    };

    return $$({
      connectWallet,
      switchNetwork,
      getSelfBalance,
      getSelfAllowance,
      approveUSDC,
      burnUSDC,
      mintUSDC,
    });
  },
  {
    persist: true,
  }
);

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(reownStore, import.meta.hot));
}
