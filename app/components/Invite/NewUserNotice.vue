<script setup lang="ts">
import Request from '@/utils/request';

let newestInvitedUser = $ref([]);
async function loadNewestInvitedUser() {
  try {
    const res = await Request({
      url: '/app-api/topic/user/invite/list',
      method: 'POST',
      data: {}
    })

    newestInvitedUser = res.data;
  } catch (e) {
    console.error('loadNewestInvitedUser', e);
  }
}

onMounted(async () => {
  await loadNewestInvitedUser();
})

const { t } = useI18n()

</script>

<template>
  <section class="sticky top-0 z-10" v-if="newestInvitedUser.length > 0">
    <van-notice-bar left-icon="volume-o" :scrollable="false">
      <van-swipe vertical class="notice-swipe h-[40px] leading-10" :autoplay="3000" :touchable="false"
        :show-indicators="false">
        <van-swipe-item v-for="item in newestInvitedUser" :key="item.id">
          {{
            t('User1 got 1000 TUIT invited AAA successfully!', {
              fathername: item.nickname, count: item.rewardNumber,
              childname: item.childNickname
            })
          }}
        </van-swipe-item>
      </van-swipe>
    </van-notice-bar>
  </section>
</template>

<i18n lang="json">{
  "en-US": {
    "User1 got 1000 TUIT invited AAA successfully!": "{fathername} got {count} TUIT invited {childname} successfully!"
  },
  "ko-KR": {
    "User1 got 1000 TUIT invited AAA successfully!": "{fathername}님이 {count} TUIT을 받고 {childname}님을 성공적으로 초대했습니다!"
  },
  "zh-TW": {
    "User1 got 1000 TUIT invited AAA successfully!": "{fathername} 獲得 {count} TUIT 成功邀請 {childname}！"
  },
  "ja-JP": {
    "User1 got 1000 TUIT invited AAA successfully!": "{fathername}さんは{count} TUITを獲得し、{childname}さんを正常に招待しました！"
  }
}</i18n>
