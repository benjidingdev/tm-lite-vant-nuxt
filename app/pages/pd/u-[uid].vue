<script setup>
const { hasTwitterLogin, x_user, doLogin } = $(supabaseStore())

definePageMeta({
  layout: "x",
});

const { t } = useI18n()
const route = useRoute()

async function capture(targetId = 'my-div', name = 'shareImageName') {
  if (!targetId) {
    return;
  }

  const target = document.getElementById(targetId);
  if (!target) {
    console.log('target not found');
    return;
  }

  await captureTargetToPng(name, target);
}

let user = $ref({})
const isMe = $computed(() => !!hasTwitterLogin && route.params.uid === x_user.id)
async function loadUser(uid) {
  const rz = await doFetch(`/api/pd/${uid}`)
  user = {
    id: rz.userId,
    avatar: rz.x_profiles?.avatar,
    name: rz.x_profiles?.fullname,
    user_name: rz.x_profiles?.slug,
    refCount: rz.refCount,
  }
  // console.log(rz)
}

onMounted(async () => {
  // console.log(route.params.uid, hasTwitterLogin, x_user.id, isMe)
  if (isMe) {
    user = x_user
    return
  }
  await loadUser(route.params.uid)
})

const handleLogin = async () => {
  await doLogin({pathname: '/pd/u-[uid]', refId: route.params.uid})
}
</script>

<template>
  <article class="w-full h-full flex flex-col justify-center items-center px-8">

    <PdUser :user />

    <div class="w-full flex flex-col items-center justify-center bg-[#000000] text-white mt-12">
      <template v-if="isMe">
        <button class="mb-2 w-full rounded-md bg-[#1ce4a8] py-4 font-bold text-black" @click="capture('my-div', 'shareImageName')">
          <span>{{ t('share') }}</span>
        </button>

        <div class="relative flex items-center rounded-xl bg-[#090b0e] text-sm text-gray-400">
          <span class="flex-grow text-left">{{ t('share-desc', { coin: 'PDCoin' }) }}</span>
        </div>
      </template>

      <template v-if="!hasTwitterLogin">
        <button class="mb-2 w-full rounded-md bg-[#1ce4a8] py-4 font-bold text-black" @click="handleLogin">
          <span>{{ t('btn', { coin: 'PDCoin' }) }}</span>
        </button>

        <div class="relative flex items-center rounded-xl bg-[#090b0e] text-sm text-gray-400">
          <span class="flex-grow text-left">{{ t('btn-desc', { coin: 'PDCoin' }) }}</span>
        </div>
      </template>
    </div>

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
