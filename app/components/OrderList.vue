<template>
  <div
    class="w-full bg-color-white p-4 h-[calc(100vh-80px-248px-50px)] overflow-auto"
  >
    <van-card
      v-for="item in list"
      :key="item.id"
      currency="$"
      :price="item.profit + '(' + item.profitRate + '%)'"
      :desc="item.description"
      :title="item.question"
      :thumb="item.image"
    >
      <template #footer>
        <van-button plain size="mini" type="primary" @click="showShares(item)"
          >Shares</van-button
        >
      </template>
    </van-card>
  </div>
  <van-dialog v-model:show="show" title="SHARE TO" confirmButtonText="Confirm">
    <div class="w-full pb-2 px-10">
      <div class="font-sans text-center text-white text-lg font-bold">
        SHARE TO
      </div>
      <div class="flex justify-between w-full py-4">
        <!-- <div :class="`bg-[url('${item.icon}')]`" class="w-12 h-12 bg-cover cursor-pointer" 
                    v-for="item in props.images" @click="goUrl(item.url)"/> -->
        <img
          class="w-12 h-12 bg-cover"
          src="@/assets/img/telegran.png"
          @click="goUrl('https://t.me/share/url')"
        />
        <img
          class="w-12 h-12 bg-cover"
          src="@/assets/img/twitter.png"
          @click="goUrl('https://twitter.com/intent/tweet')"
        />
        <img
          class="w-12 h-12 bg-cover"
          src="@/assets/img/whatsapp.png"
          @click="goUrl('https://api.whatsapp.com/send')"
        />
      </div>
    </div>
  </van-dialog>
</template>

<script setup lang="ts">
import { userHoldInfoList } from "@/api/positions";
import { onMounted } from "vue";
let list = $ref([]);
let show = $ref(false);
const { userInfo } = $(coreStore());

const voState = $ref({
  isLoading: false,
  queryParams: {
    pageNo: 1,
    pageSize: 20,
    orderBy: "created desc",
    key: "",
  },
  total: 0,
});
let marketId = $ref(0);

const showShares = (item) => {
  show = true;
  // You can handle the item data here if needed
  marketId = item.marketId;
};

const fetchUserHoldInfoList = async () => {
  const res = await userHoldInfoList(voState.queryParams);
  if (voState.queryParams.pageNo === 1 && res?.data) {
    list = res?.data?.list;
  } else {
    list = list.concat(res?.data?.list);
  }
  voState.total = res?.data?.total;
  voState.isLoading = false;
};

const goUrl = (url) => {
  let path = `${url}?url=${origin}?inviteCode=${userInfo.inviteCode}&text=Get Start With Turing Market`;
  origin = `${origin}/marketsDetails`;
  path = `${url}?url=${origin}?id=${marketId}`;
  window.open(path);
  // handleClose();
};

onMounted(() => {
  fetchUserHoldInfoList();
});
</script>
