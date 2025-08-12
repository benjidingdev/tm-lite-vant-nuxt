<template>
  <div class="w-full">
    <div class="w-full h-full flex flex-col">
      <div class="user-container text-center mx-auto">
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
          <li class="p-4 bg-sky-100 rounded-lg flex justify-center">
            <div class="text-center">
              <p class="my-3 text-xs text-[#727272]">positionValue</p>
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

          <li class="p-4 bg-sky-100 rounded-lg flex flex-col justify-center">
            <div class="text-center">
              <p class="my-3 text-xs text-[#727272]">profit</p>
              <p class="text-xl font-bold">
                ＄{{ amountSeparate(voData.userInfo.profit) }}
              </p>
            </div>
          </li>
          <li class="p-4 bg-sky-100 rounded-lg flex flex-col justify-center">
            <div class="text-center">
              <p class="my-3 text-xs text-[#727272]">tradedVolume</p>
              <p class="text-xl font-bold">
                ＄{{ amountSeparate(voData.userInfo.volumnTrade) }}
              </p>
            </div>
          </li>
          <li class="p-4 bg-sky-100 rounded-lg flex flex-col justify-center">
            <div class="text-center">
              <p class="my-3 text-xs text-[#727272]">marketsTradedNum</p>
              <p class="text-xl font-bold">
                {{ voData.userInfo.tradeMarkets }}
              </p>
            </div>
          </li>
        </ul>

        <!-- <ul class="my-6 border-b bg-sky-100 flex flex-row">
          <li
            v-for="item in tabBar.list"
            :key="item"
            @click="tabClick(item.id)"
            class="mr-6 py-4 3xl:text-base 2xl:text-base xl:text-base lg:text-sm md:text-sm xs:text-xs text-[#828282] dark:text-white purple:text-[#828282] border-b-2 border-transparent cursor-pointer"
            :class="{ 'active-tab': tabBar.current === item.id }"
          >
            {{ item.name }}
          </li>
        </ul> -->
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
