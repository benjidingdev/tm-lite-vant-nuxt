<script setup lang="ts">
import { ref } from "vue";
import { showToast } from "vant";
import { getUserBalance, getClaimSignData, cashOut } from "@/api/userInfo";

const { t } = useI18n();
const { modalIsShow } = $(uiStore());
const { holdResult } = $(tradeStore());
const { signPayout, updateWalletBalance } = $(walletStore());

const confirmPosition = async (useTokens) => {
  showToast(`Redeeming ${holdResult.outcomeName}...`);
  try {
    if (holdResult.status !== 5) {
      showToast("The market cannot fulfill its obligations.");
      return false;
    }
    const signData = await getClaimSignData({
      marketId: holdResult.marketId,
      isDeduction: useTokens,
    });
    const sign = await signPayout(signData.data);
    if (!sign) return;
    let res = await cashOut({ nonce: signData.data.nonce, sign: sign });

    if (res.code === 0) {
      showToast(`${holdResult.total}$ is cashout`);
      // getList();
      updateWalletBalance();
    } else {
      showToast(`Redeem Failed as ${res.msg}`);
    }
  } catch (error) {
    showToast(`Redeem Failed...`);
  }
};
</script>

<template>
  <van-popup
    v-model:show="modalIsShow.showRedeemPopup"
    destroy-on-close
    round
    position="bottom"
  >
    <div class="flex flex-col items-center p-5">
      <img
        v-if="holdResult.image"
        class="w-12 h-12 rounded-lg"
        :src="holdResult.image"
      />
      <div class="my-1 text-lg font-bold">
        Redeem {{ holdResult.outcomeName }}
      </div>
      <div class="text-sm text-[var(--text-slate-gray)]">
        {{ holdResult.groupItemTitle }}
      </div>
      <div
        class="w-full mt-3 py-2 flex flex-col items-center bg-gray-100 rounded-lg text-lg font-bold"
      >
        <p>Receive</p>
        <p class="mt-1 text-[var(--sport-button-bg-active-yes)]">
          ${{ holdResult.total }}
        </p>
      </div>
      <van-button
        class="mt-4! rounded-lg"
        type="success"
        block
        @click="confirmPosition()"
      >
        {{ $t("Redeem") }}
      </van-button>
    </div>
  </van-popup>
</template>


