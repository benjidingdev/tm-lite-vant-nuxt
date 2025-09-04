<script setup>
import Request from '@/utils/request'

const { userInfo } = $(userStore());

onMounted(() => {
  console.log({ userInfo });
  loadShareUser();
})

let shareUserList = $ref([]);
let total = $ref(0);
async function loadShareUser() {
  try {
    const rz = await Request({
      url: `/app-api/topic/user/shareUserPage`,
      method: 'post',
      data: {
        pageNo: 1,
        pageSize: 12
      }
    })
    console.log('loadShareUser', userInfo.inviteCode, rz);

    if (rz.data.list) {
      shareUserList = [
        ...rz.data.list,
      ];
      total = rz.data.total;
      total = 1
    }
  } catch (e) {
    console.error('loadShareUser', e);
  }
}

let active = $ref(-1);
watch(() => total, (newVal) => {
  if (newVal > 0 && newVal < 5) {
    active = 0;
  } else if (newVal >= 5 && newVal < 10) {
    active = 1;
  } else if (newVal >= 10 && newVal < 50) {
    active = 2;
  } else if (newVal >= 50) {
    active = 3;
  }
})
</script>

<template>
  <div class="w-full flex flex-col items-center justify-center bg-white p-4 space-x-1">


    <div class="w-full" v-if="total > 0">
      <van-steps :active="active">
        <van-step>1</van-step>
        <van-step>5</van-step>
        <van-step>10</van-step>
        <van-step>50</van-step>
      </van-steps>
    </div>

    <div class="flex-1 text-[14px] text-orange-500">{{ $t("inviteCount", { count: total, remainCount: 50 - total })
      }}</div>
  </div>
</template>
