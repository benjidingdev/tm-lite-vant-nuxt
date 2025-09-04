<script setup lang="ts">
import Request from '@/utils/request'

let rz:any = $ref({});
async function loadUserCoin() {

  try {
    const res = await Request({
      url: `/app-api/topic/token/account/get`,
    });
    rz = res.data;
    console.log('loadUserCoin res', res);
  } catch (error) {
    console.log('loadUserCoin error', error);
  }

}

onMounted(() => {
  // console.log('userInfo', userInfo);
  loadUserCoin();
})
</script>

<template>
  <div class="text-center text-[24px] text-orange-500">{{ rz?.totalAmount || 0 }} TUIT</div>
</template>
