<script setup lang="ts">
  import {
    TYPEHASH_PERMIT,
  } from "@/types/sign";
  const { wallet, amountPermit, walletClient, walletConfig } = $(walletStore())
  const testPermit = async () => {
    const param = {
      owner: wallet.address,
      spender: walletConfig!.contract.address,
      value: 10,
      nonce: nonce,
      deadline: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365 * 100,
    };
    const typeDomain = {
      name: 'USD Coin',
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
    console.log('result', result)
  }
</script>
<template>
  <div class="h-screen px-4">
    <div class="text-xxs"> {{ shortenAddress(wallet?.address) }}</div>
    <div @click="amountPermit">amountPermit</div>
  </div>
</template>
