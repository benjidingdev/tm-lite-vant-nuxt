<script setup>
import Request from '@/utils/request';

const { userInfo } = $(userStore());

let leaderBoard = $ref([]);
async function loadLeaderBoard() {
  try {
    const res = await Request({
      url: '/app-api/topic/markets/ranks',
      method: 'POST',
      data: {
        type: "share",
        filterType: 'all',
        limit: 10
      }
    })

    console.log('loadLeaderBoard', res);
    leaderBoard = res.data;
  } catch (e) {
    console.error('loadLeaderBoard', e);
  }
}

onMounted(async () => {
  await loadLeaderBoard();
})
</script>

<template>
  <section class="w-full flex flex-col items-center justify-center bg-white py-2 text-sm px-5">
    <p class="text-center text-[16px] w-full flex justify-between items-center mb-2">
      <span>{{ $t('Invite Leaderboard') }}</span>
      <span class="text-[12px] text-gray-500 mt-2">{{ $t('(Top 10)') }}</span>
    </p>

    <div class="w-full grid grid-cols-[2fr_1fr_1fr] justify-center items-center space-y-2 text-gray-700">
      <div class="flex justify-start items-center space-x-1 border-0">
        <span>{{ $t('Rank') }}</span>
      </div>
      <div class="text-center border-0">{{ $t('Referrals') }}</div>
      <div class="justify-self-end border-0">{{ $t('TUIT') }}</div>
    </div>

    <div class="w-full grid grid-cols-[2fr_1fr_1fr] justify-center items-center space-y-2 text-gray-700"
      v-for="(user, i) in leaderBoard" :key="i">
      <div class="flex justify-start items-center space-x-1 border-0">
        <span>{{ i + 1 }}.</span>
        <img :src="user.avatar" class="rounded-full size-4" alt="">
        <span>{{ user.nickname }}</span>
      </div>
      <div class="text-center border-0">{{ user.total }}</div>
      <div class="justify-self-end border-0">700 TUIT</div>
    </div>
  </section>
</template>
