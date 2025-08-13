<template>
  <div class="w-full">
    <div class="w-full h-full flex flex-col">
      <div class="user-container text-center mx-auto flex justify-center items-center">
        <img
          v-if="voData.userInfo.avatar"
          class="w-16 h-16 mx-auto rounded-full"
          :src="voData.userInfo.avatar"
        />
        <img
          v-else
          class="w-16 h-16 mx-auto rounded-full"
          src="@/assets/img/default.webp"
        />
        <div class="flex-1 h-6 flex flex-col">
          <p class="text-xl font-bold">
            {{ voData.userInfo.nickname }}
          </p>
        </div>
      </div>
      <div class="potifolio-container p-4">
        <ul class="my-2 grid grid-cols-2 gap-4">
          <li class="p-2 bg-sky-100 rounded-lg flex justify-center">
            <div class="text-center">
              <p class="my-1 text-xs text-[#727272]">positionValue</p>
              <p
                v-if="voData.userInfo && voData.userInfo.positionValue"
                class="text-xl font-bold"
              >
                ＄{{ voData.userInfo.positionValue.toFixed(2) }}
              </p>
              <p v-else class="text-xl font-bold">
                ＄{{ voData.userInfo.positionValue }}
              </p>
            </div>
          </li>

          <li class="p-2 bg-sky-100 rounded-lg flex flex-col justify-center">
            <div class="text-center">
              <p class="my-1 text-xs text-[#727272]">profit</p>
              <p class="text-xl font-bold">
                ＄{{ amountSeparate(voData.userInfo.profit) }}
              </p>
            </div>
          </li>
          <li class="p-2 bg-sky-100 rounded-lg flex flex-col justify-center">
            <div class="text-center">
              <p class="my-1 text-xs text-[#727272]">tradedVolume</p>
              <p class="text-xl font-bold">
                ＄{{ amountSeparate(voData.userInfo.volumnTrade) }}
              </p>
            </div>
          </li>
          <li class="p-2 bg-sky-100 rounded-lg flex flex-col justify-center">
            <div class="text-center">
              <p class="my-1 text-xs text-[#727272]">marketsTradedNum</p>
              <p class="text-xl font-bold">
                {{ voData.userInfo.tradeMarkets }}
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useAccount } from "@wagmi/vue";
import moment from "moment";
import { getUserProfile } from "@/api/userInfo";
import {
  encryptMiddle,
  amountSeparate,
  amountMoney,
  unitConvert,
} from "@/utils/processing";

let voData = $ref({
  userInfo: {},
  pageNo: 1,
  pageSize: 10,
  holdList: [],
  holdTotal: 0,
  activityList: [],
  activityTotal: 0,
  showShare: false,
  shareId: "",
});
const { address } = $(useAccount());

const getUserInfo = async () => {
  try {
    let res = await getUserProfile({
      proxyWallet: address,
    });
    if (res.code === 0) {
      voData.userInfo = res.data;
    }
  } catch (e) {
    //console.log('Failure message：', e)
  }
};

onMounted(() => {
  getUserInfo();
});
</script>
