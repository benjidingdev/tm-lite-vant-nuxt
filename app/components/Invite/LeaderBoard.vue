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
  <section class="w-full flex flex-col items-center justify-center py-2 text-sm p-5">
    <p class="text-center w-full flex justify-between items-end mb-4 px-5 border-0">
      <span class="border-0 text-[18px] font-[900]">{{ $t('Invite Leaderboard') }}</span>
      <span class="text-[12px] text-gray-700 border-0">{{ $t('(Top 10)', totalUsers) }}</span>
    </p>

    <div class="w-full flex justify-between items-center text-gray-900 mb-2 px-5 font-[600] mb-4">
      <div class="flex justify-start items-center space-x-1 border-0">
        <span>{{ $t('Rank') }}</span>
      </div>
      <div class="justify-self-end border-0">{{ $t('Referrals') }}</div>
      <!-- <div class="justify-self-end border-0">{{ $t('TUIT') }}</div> -->
    </div>

    <div class="w-full flex justify-between items-center text-gray-700 border-0 mb-4 px-5"
      v-for="(user, i) in leaderBoard" :key="i">
      <div class="flex justify-self-start space-x-1 border-0">
        <span>{{ i + 1 }}.</span>
        <img :src="user?.avatar" class="rounded-full size-4" alt="">
        <span>{{ user?.nickname }}</span>
      </div>
      <div class="justify-self-end border-0">{{ user?.total }}</div>
    </div>
  </section>
</template>
