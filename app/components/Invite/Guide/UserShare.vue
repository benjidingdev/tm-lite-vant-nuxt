<script setup>
// import Request from '@/utils/request'

const { userInfo } = $(userStore());

async function onShare() {
  // const target = document.getElementById('shareTarget');
  // await captureTargetToPng('shareImageName', target);
  inviteUser(userInfo.inviteCode, '/invite/guide')
}

// async function loadUserTasks(inviteCode) {
//   try {
//     const rz = await Request({
//       url: `/app-api/topic/task/list`,
//     })
//     console.log('inviteUser', rz);
//     if (rz.code === 200) {
//       // show success message or perform other actions
//     }
//   } catch (e) {
//     console.error('inviteUser', e);
//     alert('An error occurred while inviting the user.');
//   }
// }

onMounted(() => {
  // loadUserTasks();
  console.log({ userInfo });
})
</script>


<template>
  <section class="w-full flex flex-col items-center justify-center space-y-2 p-5">
    <div id="shareTarget"
      class="w-full h-[60dvh] flex flex-col items-center justify-center bg-gray-100 rounded-[12px] p-5 relative">
      <slot />

      <div class="flex-1 flex flex-col items-center justify-center">
        <img class="size-20 rounded-full" :src="userInfo.avatar" alt="">
        <div class="text-center">{{ userInfo.nickname }}</div>

        <div class="text-center text-[48px] text-orange-500 mt-12">+10 TUIT</div>
      </div>

      <div class="flex justify-between items-center w-full space-x-2">
        <van-button block type="primary" @click="onShare">{{ $t("Share") }}</van-button>
      </div>

      <div class="text-center text-[12px] text-gray-500 mt-2">{{ $t('success invite a friend and get the rewards.') }}
      </div>

    </div>
  </section>
</template>
