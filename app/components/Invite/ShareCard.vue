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

let show = ref(true);
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

        <div style="color: red" @click="show = true">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"
            viewBox="0 0 24 24"><!-- Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE -->
            <path fill="currentColor"
              d="M10.6 16q0-2.025.363-2.912T12.5 11.15q1.025-.9 1.563-1.562t.537-1.513q0-1.025-.687-1.7T12 5.7q-1.275 0-1.937.775T9.125 8.05L6.55 6.95q.525-1.6 1.925-2.775T12 3q2.625 0 4.038 1.463t1.412 3.512q0 1.25-.537 2.138t-1.688 2.012Q14 13.3 13.738 13.913T13.475 16zm1.4 6q-.825 0-1.412-.587T10 20t.588-1.412T12 18t1.413.588T14 20t-.587 1.413T12 22" />
          </svg>
        </div>

      </div>
    </div>
  </section>

  <van-dialog v-model:show="show" title=" " closeable :show-confirm-button="false">
    <InviteUserList :totalInvite :shareUserList />
  </van-dialog>
</template>
