<script setup>
const { hasTwitterLogin, x_user } = $(supabaseStore())

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
  console.log(rz)
  user = rz
}

onMounted(async () => {
  // console.log(route.params.uid, hasTwitterLogin, x_user.id, isMe)
  if (isMe) {
    user = x_user
    return
  }
  await loadUser(route.params.uid)
})
</script>

<template>
  <article class="w-full h-full flex flex-col justify-center items-center pt-0">

    <PdUser :user />

    <div class="flex flex-col items-center justify-center bg-[#000000] text-white p-2 mt-4">
      <div class="relative flex items-center rounded-xl bg-[#090b0e] p-4 text-sm font-semibold text-gray-400">
        <span class="flex-grow text-left">{{ t('btn-desc', { coin: 'PDCoin' }) }}</span>
      </div>

      <button class="mt-2 w-full rounded-md bg-[#1ce4a8] py-4 font-bold text-black"
        @click="capture('my-div', 'shareImageName')">
        <span>{{ t('btn', { coin: 'PDCoin' }) }}</span>
      </button>
    </div>

  </article>
</template>

<i18n lang="json">{
  "en-US": {
    "btn-desc": "Login with Twitter to get {coin}",
    "btn": "Claim {coin}"
  },
  "zh-TW": {
    "btn-desc": "使用 Twitter 登錄以獲取 {coin}",
    "btn": "領取 {coin}"
  },
  "ja-JP": {
    "btn-desc": "Twitterでログインして{coin}を入手しよう",
    "btn": "{coin}を受け取る"
  },
  "ko-KR": {
    "btn-desc": "Twitter로 로그인하여 {coin}을 받으세요",
    "btn": "{coin} 받기"
  }
}</i18n>


<style scoped>
.bg {
  background: linear-gradient(153deg, #030b06 7%, #052010 24%, #071b10 31%, #06180f 44%, #05130c 54%, #072114 65%, #083018 86%, #051c0f 98%);
  background-blend-mode: unset;
}
</style>
