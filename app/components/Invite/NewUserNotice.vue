<script setup>
import Request from '@/utils/request';

let newestInvitedUser = $ref([]);
async function loadNewestInvitedUser() {
  try {
    const res = await Request({
      url: '/app-api/topic/user/invite/list',
      method: 'POST',
      data: {
      }
    })

    console.log('loadNewestInvitedUser', res);
    newestInvitedUser = res.data;
  } catch (e) {
    console.error('loadNewestInvitedUser', e);
  }
}

onMounted(async () => {
  await loadNewestInvitedUser();
})

</script>

<template>
  <section class="sticky top-0 z-10" v-if="newestInvitedUser.length > 0">
    <van-notice-bar left-icon="volume-o" :scrollable="false">
      <van-swipe vertical class="notice-swipe h-[40px] leading-10" :autoplay="3000" :touchable="false"
        :show-indicators="false">
        <van-swipe-item>User1 got 1000 TUIT invited AAA successfully!</van-swipe-item>
        <van-swipe-item>User1 got 1000 TUIT invited BBB successfully!</van-swipe-item>
        <van-swipe-item>User1 got 1000 TUIT invited CCC successfully!</van-swipe-item>
      </van-swipe>
    </van-notice-bar>
  </section>
</template>
