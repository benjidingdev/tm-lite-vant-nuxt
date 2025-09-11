<script setup lang="ts">
const { totalInvite } = defineProps(['totalInvite', 'totalTuit']);

let active = $computed(() => {
  if (totalInvite > 0 && totalInvite < 2) {
    return 0;
  } else if (totalInvite >= 2 && totalInvite < 3) {
    return 1;
  } else if (totalInvite >= 3) {
    return 3;
  } else {
    return -1;
  }
});

const partnerCount = 3
</script>

<template>
  <div class="w-full flex flex-col items-center justify-center p-5 space-x-1">

    <div class="w-full p-5 space-y-6 bg-white">
      <div class="w-full flex justify-between space-x-2">
        <div>
          <van-icon name="fire-o" color="#1989fa" />
        </div>

        <div class="flex-1 ">
          <div class="mb-1">{{ $t('Refer a friend and earn 10 TUIT.', {count: 10}) }}</div>
          <div class="text-gray-500 text-[14px]">{{
            $t(`The reward is issued to your account after the successful registration of a friend.`) }}
          </div>
        </div>
      </div>

      <div class="w-full flex justify-between space-x-2">
        <div>
          <van-icon name="gem-o" color="#ee0a24" />
        </div>

        <div class="flex-1 ">
          <div class="mb-1 font-[400]">{{ $t("Invite 3 friends to become a partner.", {count: partnerCount}) }}</div>
          <div class="text-gray-500 text-[14px]">

            <!-- <van-steps :active="active" style="--van-steps-background: transparent;">
              <van-step>1</van-step>
              <van-step>2</van-step>
              <van-step>3</van-step>
            </van-steps> -->

            <div class="">{{ $t("inviteCount", { count: totalInvite, remainCount: partnerCount - totalInvite })
            }}</div>
          </div>
        </div>
      </div>

    </div>


  </div>
</template>
