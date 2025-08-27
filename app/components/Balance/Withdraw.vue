<script setup lang="ts">
import { withdrawRequest } from "@/api/wallet";
import { parseUnits } from "viem";

const { wallet, publicClient } = $(privyStore());
const { signWithdraw, walletConfig } = $(walletStore());
const { getNonce } = $(authStore());

let toAddress = $ref("");
let tokenAmount = $ref(1);
let currentStep = $ref(1);
let status = $ref("processing");

const waitTransaction = async (hash: string) => {
  try {
    const receipt = await publicClient.waitForTransactionReceipt({
      hash,
    });
    if (receipt && receipt.status === "success") {
      return receipt.transactionHash;
    } else {
      throw new Error("Transaction failed");
    }
  } catch (error) {
    console.log("waitTransaction error:", error);
    throw error;
  }
};

const withdraw = async () => {
  currentStep = 2;
  // get a new nonce here
  const { data: nonce } = await getNonce(wallet.address);
  const amount_ = 10; // amount in USDC
  const signParams = {
    from: wallet.address,
    to: toAddress,
    amount: parseUnits(amount_.toString(), 6),
    tokenAddress: walletConfig!.main.address,
    nonce,
  };
  console.log(signParams, "signParams");
  const userSign = await signWithdraw(signParams);
  const requestParams = {
    toAddress,
    amount_,
    nonce,
    userSign,
  };
  const hash = withdrawRequest(requestParams);
  const ts = await waitTransaction(hash);
  console.log(ts);
};
</script>

<template>
  <div v-if="currentStep === 1" class="step-one w-full">
    <van-form @submit="onSubmit">
      <van-field
        v-model="toAddress"
        name="username"
        label="Reciplent address"
        placeholder="Reciplent address"
        :rules="[{ required: true, message: 'Reciplent address' }]"
      />
      <van-field
        v-model="tokenAmount"
        name="Amount"
        label="Amount"
        placeholder="Amount"
        :rules="[{ required: true, message: 'Amount' }]"
      />
      <van-cell>
        <van-button
          block
          type="primary"
          native-type="submit"
          @click="withdraw"
        >
          Withdraw
        </van-button>
      </van-cell>
    </van-form>
  </div>
  <div v-if="currentStep === 2" class="step-two w-full">
    <van-count-down :time="time">
      <template #default="timeData">
        <span class="block">{{ timeData.hours }}</span>
        <span class="colon">:</span>
        <span class="block">{{ timeData.minutes }}</span>
        <span class="colon">:</span>
        <span class="block">{{ timeData.seconds }}</span>
      </template>
    </van-count-down>
    <van-cell-group>
      <van-cell title="Fill status" :value="status" />
      <van-cell title="You receive" value="1.0007" />
      <van-cell title="Transcation ID" value="0x123qsdq123sdad" />
    </van-cell-group>
    <div class="flex mt-2">
      <van-button round block type="primary" native-type="submit">
        Close
      </van-button>
      <van-button
        round
        block
        type="primary"
        native-type="submit"
        @click="currentStep = 1"
      >
        New Withdrawal
      </van-button>
    </div>
  </div>
</template>

<style>
.colon {
  display: inline-block;
  margin: 0 4px;
  color: #1989fa;
}
.block {
  display: inline-block;
  width: 22px;
  color: #fff;
  font-size: 12px;
  text-align: center;
  background-color: #1989fa;
}
</style>
