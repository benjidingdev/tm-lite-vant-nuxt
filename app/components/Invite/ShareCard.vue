<script setup>
const { userInfo } = $(userStore());

const { totalInvite, totalTuit } = defineProps(['totalInvite', 'totalTuit']);

async function handleShare() {
  // const target = document.getElementById('shareTarget');
  // await captureTargetToPng('shareImageName', target);
  inviteUser(userInfo.inviteCode, '/invite/guide');
}

// async function handelImage() {
//   const target = document.getElementById('shareTarget');
//   await captureTargetToPng('shareImageName', target);
// }

onMounted(() => {
  console.log({ userInfo });
});
</script>


<template>
  <section class="w-full flex flex-col items-center justify-center space-y-2 p-5">
    <div id="shareTarget"
      class="w-full flex flex-col items-center justify-center bg-gray-100 rounded-[12px] p-5 relative">

      <p class="text-[12px] text-gray-500 mb-4">
        <span>{{ $t("Social Card on ") }}</span>
        <span class="text-orange-500">{{ $t('turingm.io') }}</span>
      </p>
      <div class="flex-1 flex flex-col items-center justify-center">
        <img class="size-30 rounded-full" :src="userInfo.avatar" alt="">
        <div class="text-center text-gray-700">{{ userInfo.nickname }}</div>
      </div>

      <div class="w-full flex-1 flex items-center justify-between mt-4">
        <div class="flex-1 flex flex-col items-center justify-center border-0 p-2">
          <div>{{ totalInvite || '-' }}</div>
          <div class="text-gray-500 text-[12px]">{{ $t('Referrals') }}</div>
        </div>

        <div class="flex-1 flex flex-col items-center justify-center p-2">
          <div>{{ totalTuit || '-' }}</div>
          <div class="text-gray-500 text-[12px]">TUIT</div>
        </div>

      </div>
    </div>

    <div class="space-x-4 flex w-1/2">
      <!-- <div>
        <van-button type="default" @click="handelImage">
          <van-icon name="photo-o" />
          {{ $t("Save") }}
        </van-button>
      </div> -->
      <van-button block type="success" @click="handleShare">
        <van-icon name="share-o" />
        {{ $t("Invite") }}
      </van-button>
    </div>


  </section>
</template>
