<script setup>
const { hasTwitterLogin, x_user, doLogin } = $(supabaseStore())

definePageMeta({
  layout: "x",
});

const { t } = useI18n()
const route = useRoute()

async function capture(targetId = 'my-div', name = 'shareImageName') {
  // if (!targetId) {
  //   return;
  // }

  // const target = document.getElementById(targetId);
  // if (!target) {
  //   console.log('target not found');
  //   return;
  // }

  // await captureTargetToPng(name, target);
}

function handleShare() {

  let shareLink = new URL(location.href);
  shareLink.searchParams.append('refId', x_user.id)
  shareLink = shareLink.toString()
  const text = `
  I’m joining the TuringM Prediction Master 🏆🏆🏆🏆🏆

Follow @TuringMarket, @TuringM_CN, RT and LIKE via ${shareLink} to get 1000 testnet $TUIT.

1000 USDT up for grabs!
 `;

  const hashtags = "TuringM,TuringMaster,Airdrop";
  // handleRetweet({ hashtags, refId: x_user.id, text })  // TODO:: shareInvite from utils
}

let user = $ref({})
let isLoading = $ref(true)
async function loadUser(uid) {
  try {
    isLoading = true
    const rz = await doFetch(`/api/pd/${uid}`)
    console.log(rz)
    user = {
      id: rz.id,
      avatar: rz?.avatar,
      name: rz?.fullname,
      user_name: rz?.slug,
      refCount: rz.refCount,
    }
  } catch (error) {
    console.log('load user error', error)
  } finally {
    isLoading = false
  }
}

onMounted(async () => {
  // console.log(route.params.uid, hasTwitterLogin, x_user.id, isMe)
  await loadUser(route.params.uid)
})

const handleLogin = async () => {
  const params = {
    pathname: '/pd/u-[uid]',
  }

  const url = new URL(location.href);
  const refId = url.searchParams.get('refId')
  if (refId) {
    params.refId = refId
  }
  await doLogin(params)
}
</script>

<template>
  <article class="w-full h-full flex flex-col justify-center items-center px-8">

    <van-skeleton :loading="isLoading">
      <template #template>
        <div class="w-[calc(100vw-64px)] h-[80vh] flex flex-col justify-center items-center">
          <div class="w-full h-[70vw] flex justify-center items-center bg-[var(--van-active-color)] rounded-[24px]">
            <van-loading size="48" />
          </div>

          <!-- <van-skeleton-image /> -->
          <div :style="{ marginTop: '42px', width: '100%' }">
            <van-skeleton-paragraph row-width="60%" />
            <van-skeleton-paragraph />
            <van-skeleton-paragraph />
            <van-skeleton-paragraph />
          </div>
        </div>
      </template>
    </van-skeleton>

    <template v-if="!isLoading">
      <PdUser :user />

      <div class="w-full flex flex-col items-center justify-center bg-[#000000] text-white mt-12">
        <template v-if="hasTwitterLogin">
          <button class="mb-2 w-full rounded-md bg-[#1ce4a8] py-4 font-bold text-black"
            @click="handleShare">
            <span>{{ t('share') }}</span>
          </button>

          <div class="relative flex items-center rounded-xl bg-[#090b0e] text-sm text-gray-400">
            <span class="flex-grow text-left">{{ t('share-desc', { coin: 'PDCoin' }) }}</span>
          </div>
        </template>

        <template v-else>
          <button class="mb-2 w-full rounded-md bg-[#1ce4a8] py-4 font-bold text-black" @click="handleLogin">
            <span>{{ t('btn', { coin: 'PDCoin' }) }}</span>
          </button>

          <div class="relative flex items-center rounded-xl bg-[#090b0e] text-sm text-gray-400">
            <span class="flex-grow text-left">{{ t('btn-desc', { coin: 'PDCoin' }) }}</span>
          </div>
        </template>
      </div>
    </template>


  </article>
</template>

<i18n lang="json">{
  "en-US": {
    "btn-desc": "Login with Twitter to get {coin}",
    "btn": "Claim {coin}",
    "share": "Share",
    "share-desc": "Share your friends to get more {coin}"
  },
  "zh-TW": {
    "btn-desc": "使用 Twitter 登錄以獲取 {coin}",
    "btn": "領取 {coin}",
    "share": "分享",
    "share-desc": "分享您的好友以獲取更多 {coin}"
  },
  "ja-JP": {
    "btn-desc": "Twitterでログインして{coin}を入手しよう",
    "btn": "{coin}を受け取る",
    "share": "共有",
    "share-desc": "友達に共有して、{coin}を得よう"
  },
  "ko-KR": {
    "btn-desc": "Twitter로 로그인하여 {coin}을 받으세요",
    "btn": "{coin} 받기",
    "share": "공유",
    "share-desc": "친구에게 공유하여 {coin}을 받으세요"
  }
}</i18n>


<style scoped>
.bg {
  background: linear-gradient(153deg, #030b06 7%, #052010 24%, #071b10 31%, #06180f 44%, #05130c 54%, #072114 65%, #083018 86%, #051c0f 98%);
  background-blend-mode: unset;
}
</style>
