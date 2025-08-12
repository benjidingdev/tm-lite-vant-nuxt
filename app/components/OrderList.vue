<template>
  <div class="w-full bg-color-white p-4 h-[calc(100vh-170px-248px-88px)] overflow-auto">
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
        <van-button plain size="mini" type="primary">Shares</van-button>
      </template>
    </van-card>
  </div>
</template>

<script setup lang="ts">
import { userHoldInfoList } from "@/api/positions";
import { onMounted } from "vue";
let list = $ref([]);
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
onMounted(() => {
  fetchUserHoldInfoList();
});
</script>
