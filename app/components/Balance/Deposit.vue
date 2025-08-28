<script setup lang="ts">
import { showToast } from "vant";
const { userBalance, shortWalletAddress, wallet } = $(walletStore());
let { depositData } = $(depositStore());

const currentStep = $ref(1);

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    showToast("Copied to clipboard");
  } catch (err) {
    console.error("copy failed:", err);
  }
};

let result = $ref("");
let pickerValue = $ref([]);
let showChainPicker = $ref(false);
let columns = [
  { text: "AVALANCHE", value: "avalanche" },
  { text: "ETH", value: "eth" },
];

const onConfirm = ({ selectedValues, selectedOptions }) => {
  result = selectedOptions[0]?.text;
  pickerValue = selectedValues;
  showChainPicker = false;
};

const deposit = async () => {
  console.log("depositData", depositData);
};
</script>
<template>
  <van-cell-group>
    <van-notice-bar
      class="my-2"
      color="#a7a7a7"
      background="#f9f9f9"
      left-icon="balance-pay"
    >
      <span class="font-xs">TuringMarket Balance:${{ userBalance }}</span>
    </van-notice-bar>
    <div v-if="currentStep === 1" class="step-one w-full">
      <van-form @submit="deposit">
        <van-field name="toAddress">
          <template #input>
            <BalanceForm
              v-model="depositData.depositToAddress"
              maxlength="42"
              label="Sender address"
              name="depositToAddress"
              placeholder="0x..."
            />
          </template>
        </van-field>
        <van-field name="fromAddress">
          <template #input>
            <BalanceForm
              v-model="depositData.depositFromAddress"
              maxlength="42"
              label="Recipient address"
              name="depositFromAddress"
              placeholder="0x..."
            />
          </template>
        </van-field>
        <van-field name="tokenAmount">
          <template #input>
            <BalanceForm
              v-model="depositData.tokenAmount"
              label="Amount"
              name="tokenAmount"
              placeholder="0.00"
            >
              <template #input-right>
                <div
                  class="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center space-x-2"
                >
                  <span class="text-gray-500 font-medium">USDC</span>
                  <button
                    class="px-3 bg-blue-50 text-blue-600 text-xs font-semibold rounded-md hover:bg-blue-100 transition-colors border border-blue-200"
                    type="button"
                    @click="depositData.tokenAmount = userBalance"
                  >
                    MAX
                  </button>
                </div>
              </template>
              <template #input-tips>
                <div class="flex justify-between space-x-2">
                  <span class="text-gray-400 font-medium text-xs"
                    >${{ depositData.tokenAmount }}</span
                  >
                  <span class="text-gray-400 text-xs ml-2"
                    >Balance:{{ userBalance }}
                  </span>
                </div>
              </template>
            </BalanceForm>
          </template>
        </van-field>
        <van-field
          v-model="result"
          is-link
          readonly
          name="picker"
          label="Receive Chain"
          placeholder="Receive Chain"
          @click="showChainPicker = true"
        />
        <van-popup
          v-model:show="showChainPicker"
          destroy-on-close
          position="bottom"
        >
          <van-picker
            :columns="columns"
            :model-value="pickerValue"
            @confirm="onConfirm"
            @cancel="showChainPicker = false"
          />
        </van-popup>

        <van-cell>
          <van-button
            class="rounded-lg"
            block
            type="primary"
            native-type="submit"
          >
            Deposit
          </van-button>
        </van-cell>
      </van-form>
    </div>
    <div v-if="currentStep === 2" class="step-two w-full">
      <van-cell-group>
        <van-cell>
          <van-count-down :time="time">
            <template #default="timeData">
              <span class="block">{{ timeData.hours }}</span>
              <span class="colon">:</span>
              <span class="block">{{ timeData.minutes }}</span>
              <span class="colon">:</span>
              <span class="block">{{ timeData.seconds }}</span>
            </template>
          </van-count-down>
        </van-cell>
        <van-cell title="Fill status" :value="status" />
        <van-cell title="You receive" value="1.0007" />
        <van-cell title="Transcation ID" value="0x123qsdq123sdad" />
        <van-notice-bar color="#a7a7a7" background="#f9f9f9" left-icon="info-o">
          <span class="font-xs">Experiencing problems?</span> <a>Get help</a>
        </van-notice-bar>
      </van-cell-group>
      <van-cell-group>
        <div class="flex mt-2 gap-2">
          <van-button block type="primary" plain native-type="submit">
            Close
          </van-button>
          <van-button
            block
            type="primary"
            native-type="submit"
            @click="newWithdrawal"
          >
            New Withdrawal
          </van-button>
        </div>
      </van-cell-group>
    </div>
  </van-cell-group>
</template>
