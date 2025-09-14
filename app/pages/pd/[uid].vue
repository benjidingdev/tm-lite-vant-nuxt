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
    console.error('target not found');
    return;
  }

  await captureTargetToPng(name, target);
}

const handleBack = () => {
  window.history.back()
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
  <article class="w-full h-auto flex flex-col justify-center items-center pt-0">

    <p class="text-4xl w-full mb-2 sticky top-0 z-1 flex justify-between items-center bg-black">
      <span class="text-base ml-2" @click="handleBack">
        <van-icon name="arrow-left" size="30" />
      </span>
      <span class="flex-1 text-center">
        {{
          t('Topic Detail', {
            tier: route.params.uid
          })
        }}
      </span>
    </p>

    <PdUser :user="x_user" />

    <div class="flex flex-col items-center justify-center bg-[#000000] text-white p-2 mt-4">
      <div class="relative flex items-center rounded-xl bg-[#090b0e] p-4 text-sm font-semibold text-gray-400">
        <span class="flex-grow text-left">https://mindoshare.ai/kol?ref=cm...</span>
        <div class="ml-2 flex h-8 w-8 items-center justify-center rounded-lg bg-[#14181a] p-2 text-green-500">
          <svg class="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              d="M19 12h-2v2h-2v-2h-2v2h-2v-2h-2v-2h2V8h2V6h2v2h2V6h2v6zM7 6h2V4H7v2zM5 6h2V4H5v2zM3 6h2V4H3v2zM1 6h2V4H1v2z">
            </path>
          </svg>
        </div>
      </div>

      <button class="mt-2 w-full rounded-full bg-[#1ce4a8] py-4 font-bold text-black"
        @click="capture('my-div', 'shareImageName')">
        <div class="flex items-center justify-center space-x-2">
          <svg class="h-5 w-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm4 11h-3v3h-2v-3H8v-2h3V8h2v3h3z"></path>
          </svg>
          <span>Invite your friends</span>
        </div>
      </button>
    </div>

  </article>
</template>

<i18n lang="json">{
  "en-US": {
    "Topic Detail": "Topic Detail {tier}"
  },
  "zh-TW": {
    "Topic Detail": "Topic Detail {tier}"
  },
  "ja-JP": {
    "Topic Detail": "Topic Detail {tier}"
  },
  "ko-KR": {
    "Topic Detail": "Topic Detail {tier}"
  }
}</i18n>


<style scoped>
.bg {
  background: linear-gradient(153deg, #030b06 7%, #052010 24%, #071b10 31%, #06180f 44%, #05130c 54%, #072114 65%, #083018 86%, #051c0f 98%);
  background-blend-mode: unset;
}
</style>
