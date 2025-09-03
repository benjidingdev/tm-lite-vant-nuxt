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
</script>

<template>
    <div class="w-full flex items-center justify-center bg-white p-4 space-x-1">
      <div class="flex-1 text-[12px] text-gray-700">{{ $t("inviteCount", total, { count: total, remainCount: 10 - total }) }}</div>
      <button class="bg-orange-500 px-4 py-2 rounded-[12px]" @click="inviteUser(userInfo.inviteCode)">{{ $t("invite") }}</button>
    </div>
</template>
