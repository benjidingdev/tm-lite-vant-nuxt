<script setup lang="ts">

import Request from '@/utils/request'

const { userInfo } = $(userStore());

onMounted(() => {
  console.log({ userInfo });
  loadShareUser();
  loadTotalTuit()
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
async function loadTotalTuit() {
  try {
    const rz = await Request({
      url: `/app-api/topic/token/account/get`,
      method: 'get',
    })
    console.log('loadTotalTuit', rz);

    if (rz.data) {
      totalTuit = rz.data.totalAmount || 0;
    }
  } catch (e) {
    console.error('loadTotalTuit', e);
  }
}

async function handleShare() {
  const params = {
    inviteCode: userInfo.inviteCode,
    redirect: '/invite/guide'
  };
  inviteUser(params);
}

// async function handelImage() {
//   const target = document.getElementById('shareTarget');
//   await captureTargetToPng('shareImageName', target);
// }

let show = ref(false);
</script>


<template>
  <section class="w-full flex flex-col items-center justify-center space-y-2 p-5">
    <div id="shareTarget"
      class="w-full flex flex-col items-center justify-center bg-gray-100 rounded-[12px] p-5 relative">

      <!-- <p class="text-[12px] text-gray-500 mb-4">
        <span>{{ $t("Social Card on ") }}</span>
        <span class="text-orange-500">{{ $t('turingm.io') }}</span>
      </p> -->
      <div class="flex-1 flex flex-col items-center justify-center mt-8">
        <img class="size-30 rounded-full" :src="userInfo.avatar" alt="">
        <div class="text-center text-gray-700 mt-2">{{ userInfo.nickname }}</div>
      </div>

      <div class="w-full flex-1 flex items-center justify-between mt-8">
        <div class="flex-1 flex flex-col items-center justify-center border-0 p-2">
          <div>{{ totalInvite || '-' }}</div>
          <div class="text-gray-500 text-[12px]">{{ $t('Referrals') }}</div>
        </div>

        <div class="flex-1 flex flex-col items-center justify-center p-2">
          <div>{{ totalTuit || '-' }}</div>
          <div class="text-gray-500 text-[12px]">TUIT</div>
        </div>

      </div>

      <div class="space-x-4 w-full flex justify-center items-center mt-4">
        <div class="flex-1">
          <van-button block type="success" @click="handleShare">
            <van-icon name="share-o" />
            {{ $t("Invite") }}
          </van-button>
        </div>

        <div @click="show = true">
          <van-icon color="#f60" size="24" name="/icons/help.svg" />
        </div>
      </div>
    </div>
  </section>

  <van-dialog v-model:show="show" :title="$t('Referral Rewards')" closeable :show-confirm-button="false">
    <InviteUserList :totalInvite :shareUserList />
  </van-dialog>
</template>
