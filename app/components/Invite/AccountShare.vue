<script setup>
import Request from '@/utils/request'

const { userInfo } = $(userStore());

onMounted(() => {
  console.log({ userInfo });
  loadShareUser();
})

let shareUserList = $ref([]);
let totalInvite = $ref(0);
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
      totalInvite = rz.data.total;
    }
  } catch (e) {
    console.error('loadShareUser', e);
  }
}

let totalTuit = $ref(0);
</script>


<template>
  <InviteShareCard :totalInvite :totalTuit />
  <InviteUserList :totalInvite :shareUserList />
</template>
