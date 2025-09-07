<script setup>
import Request from '@/utils/request';

let leaderBoard = $ref([]);
let totalUsers = $computed(() => leaderBoard.length);
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
    leaderBoard = res.data.list || [];
  } catch (e) {
    console.error('loadLeaderBoard', e);
  }
}

onMounted(async () => {
  await loadLeaderBoard();
})
</script>

<template>
  <div class="w-full p-5">
    <section
      class="w-full flex flex-col items-center justify-center space-y-4 text-sm p-5 bg-white rounded-[12px] border border-gray-200">
      <p class="text-center w-full flex justify-between items-end border-0">
        <span class="border-0 text-[18px]">{{ $t('Invite Leaderboard') }}</span>
        <span class="text-[12px] text-gray-700 border-0">{{ $t('(Top 10)', totalUsers) }}</span>
      </p>

      <div class="w-full flex justify-between items-center text-gray-400">
        <div class="flex-1 justify-start items-center space-x-1 border-0">
          <span>{{ $t('Rank') }}</span>
        </div>
        <div class="flex-1 text-center border-0">{{ $t('Referrals') }}</div>
        <p class="">{{ $t('Rewards') }}</p>
      </div>

      <div class="w-full flex justify-between items-center text-gray-700 border-0" v-for="(user, i) in leaderBoard"
        :key="i">
        <div class="flex-1 flex justify-start items-center space-x-3 border-0">

          <span>{{ i + 1 }}.</span>
          <div class="flex items-center space-x-1 border-0">
            <img :src="user?.avatar" class="rounded-full size-4" alt="">
            <span>{{ user?.nickname }}</span>
          </div>

        </div>
        <div class="border-0 flex-1 text-center">
          <p>{{ user?.total }}</p>
        </div>
        <div class="border-0 flex flex-col justify-center items-center space-y-1">
          <p class="text-orange-500 bg-gray-200 text-xs px-2 py-1 rounded-full"> + {{ user.total * 10 }} TUIT</p>
        </div>
      </div>
    </section>
  </div>
</template>
