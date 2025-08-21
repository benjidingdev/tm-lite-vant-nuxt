<script setup lang="ts">
import { userHoldInfoList } from "@/api/positions";
import { formatTitle } from "@/utils/processing";
import { onMounted } from "vue";

const { setModal } = $(uiStore());

let positionList = $ref([]);
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
  setModal("share", true);
  marketId = item.marketId;
};

const fetchUserHoldInfoList = async () => {
  const res = await userHoldInfoList(voState.queryParams);
  if (voState.queryParams.pageNo === 1 && res?.data) {
    positionList = res?.data?.list;
  } else {
    positionList = positionList.concat(res?.data?.list);
  }
  voState.total = res?.data?.total;
  voState.isLoading = false;
};

onMounted(() => {
  fetchUserHoldInfoList();
});
</script>

<template>
  <div
    class="w-full bg-color-white p-4 h-[calc(100vh-80px-264px-50px)] overflow-auto"
    v-if="positionList.length !== 0"
  >
    <van-card
      v-for="item in positionList"
      currency="$"
      :key="item.marketId"
      :price="item.profit + '(' + item.profitRate + '%)'"
      :desc="item.description"
      :title="item.question"
      :thumb="item.image"
    >
      <template #footer>
        <van-button plain size="mini" type="primary" @click="showShares(item)"
          >{{ $t("Shares") }}
        </van-button>
      </template>
    </van-card>
  </div>
</template>
