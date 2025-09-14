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
    console.error('target not found');
    return;
  }

  await captureTargetToPng(name, target);
}

let user = $ref({})
async function loadData(uid) {
  const rz = await $fetch(`/api/pd/${uid}`)
  console.log(rz)
}

async function loadData(uid) {
  console.log('load user info from ')
  const rz = await $fetch(`/api/pd/${uid}/`, {
    // method: 'POST',
    // body: {
    //   refId: uid
    // }
  })
  console.log(rz)
}

onMounted(async() => {
  if (x_user && x_user.id) {
    loadData(x_user.id)
  }
})

</script>

<template>
  <article class="w-full h-full flex flex-col justify-center items-center pt-0">

    <PdUser :user />

    <div class="w-full flex flex-col items-center justify-center bg-[#000000] text-white p-8 mt-12">
      <button class="w-full rounded-md  bg-gradient-to-r from-green-500 to-green-700 py-4 font-bold text-black"
        @click="doLogin">
          <span>{{ t('button') }}</span>
      </button>

      <div class="mt-2 flex items-center rounded-xl bg-[#090b0e] text-sm text-gray-400">
        <span class="flex-grow text-left">{{ t('btn-desc') }}</span>
      </div>

    </div>

  </article>
</template>

<i18n lang="json">{
  "en-US": {
    "Topic Detail": "uid: {tier}",
    "button": "Claim",
    "btn-desc": "Login with x account, and get your rewards"
  },
  "zh-TW": {
    "Topic Detail": "uid: {tier}",
    "button": "Claim",
    "btn-desc": "Login with x account, and get your rewards"
  },
  "ja-JP": {
    "Topic Detail": "uid: {tier}",
    "button": "Claim",
    "btn-desc": "Login with x account, and get your rewards"
  },
  "ko-KR": {
    "Topic Detail": "uid: {tier}",
    "button": "Claim",
    "btn-desc": "Login with x account, and get your rewards"
  }
}</i18n>


<style scoped>
.bg {
  background: linear-gradient(153deg, #030b06 7%, #052010 24%, #071b10 31%, #06180f 44%, #05130c 54%, #072114 65%, #083018 86%, #051c0f 98%);
  background-blend-mode: unset;
}
</style>
