<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const { x_user } = $(supabaseStore())

const route = useRoute()

const sharedTopic = topics()
const topic = $computed(() => sharedTopic.find(t => t.id === Number(route.params.pid)))

function onClickRetweet() {
  if (!x_user.id) {
    return
  }
  handleRetweet({
    hashtags: topic.hashtags,
    retweetTargetUrl: topic.x_info.retweetTargetLink,
    text: topic.x_info.text,
    refId: x_user.id,
    title: topic.title,
  })
}

function onClickFollow() {
  window.open('https://x.com/Pred2Moon', '_blank')
}

async function onClickDownload() {
  const target = document.getElementById('share-download');
  await captureTargetToPng('shareImageName', target);
}

let show = $ref(false)
</script>

<template>
  <section class="w-full flex flex-col items-center justify-center rounded-[16px] ">
    <p class="text-[#7000FF] text-[24px] mt-8">You are on the waitlist!</p>
    <p class="text-center text-[14px] opacity-60 mt-4">Profile picture found. first, download your custom invitation and
      then click “share on Twitter” and upload the photo.</p>

    <button class="w-full bg-[#7000FF] h-11 rounded-[8px] mt-8"
      style="box-shadow: 0px 12px 32px -8px rgba(112,0,255,0.5);" @click="show = true">
      <span class="text-white font-[900]">{{ t('Create Cover with Twitter PFP') }}</span>
    </button>

    <div class="w-full flex items-center justify-center space-x-2">
      <button class="w-full bg-[#070707] opacity-70 h-11 rounded-[8px] mt-4 flex items-center justify-center space-x-1"
        @click="onClickFollow">
        <img src="/x.webp" alt="" class="size-4">
        <span class="text-white font-[900] text-xs">{{ t('Follow on X') }}</span>
      </button>

      <button class="w-full bg-[#070707] opacity-70 h-11 rounded-[8px] mt-4 flex items-center justify-center space-x-2"
        @click="onClickRetweet">
        <img src="/x.webp" alt="" class="size-4">
        <span class="text-white font-[900] text-xs">{{ t('Share on X') }}</span>
      </button>
    </div>


  </section>

  <van-dialog v-model:show="show" :title="$t('Create Twitter profile cover')" closeable :show-confirm-button="false">
    <section class="w-full flex flex-col items-center justify-center px-6 py-8">
      <div id="share-download" class="w-full rounded-[12px] px-5 py-4 bg-black custom-bg">

        <img src="/predmoon.png" alt="" class="w-30">

        <p class="text-[48px] font-bold text-white leading-[1] mb-6">{{ t('Pred to the moon') }}</p>

        <div class="flex items-center justify-center space-x-2 bg-[rgba(0,0,0,0.1)] rounded-[12px] p-[6px]">
          <img :src="x_user?.avatar" alt="" class="size-11 rounded-[8px]">
          <div>
            <p class="opacity-80 font-[900]">{{ x_user?.name }}</p>
            <p class="text-[14px] opacity-40">@{{ x_user?.user_name }}</p>
          </div>
        </div>
      </div>

      <button class="w-full bg-[#7000FF] h-11 rounded-[8px] mt-8 flex items-center justify-center space-x-2"
        style="box-shadow: 0px 12px 32px -8px rgba(112,0,255,0.5);" @click="onClickDownload">
        <img src="/download.webp" alt="" class="size-6">
        <span class="text-white font-[900]">{{ t('Download Phote') }}</span>
      </button>

      <button class="w-full bg-[#070707] opacity-70 h-11 rounded-[8px] mt-4 flex items-center justify-center space-x-2"
        @click="onClickRetweet">
        <img src="/x.webp" alt="" class="size-6">
        <span class="text-white font-[900]">{{ t('Share on X') }}</span>
      </button>
    </section>
  </van-dialog>
</template>

<style scoped>
.custom-bg {
  background: radial-gradient(ellipse 80% 40% at 90% -20%, #7000FF, rgba(0, 0, 0, 0.1)),
    radial-gradient(ellipse 80% 40% at -20% 95%, #7000FF, rgba(0, 0, 0, 0.1)),
    radial-gradient(ellipse 40% 80% at 10% -0%, #e82cc9, rgba(0, 0, 0, 0.1)),
    radial-gradient(ellipse 90% 80% at 100% 100%, #e82cc9, rgba(0, 0, 0, 0.1));
}
</style>
