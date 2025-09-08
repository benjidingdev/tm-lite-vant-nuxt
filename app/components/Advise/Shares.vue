<script setup>
import { shortenURL } from '@/utils/shorten'

const { modalIsShow } = $(uiStore());
const { userInfo } = $(userStore());

const props = defineProps({
  title: {
    type: String
  },
  adviseId: {
    type: Number
  }
})
const goUrl = async (baseUrl) => {
  const origin = window.location.origin
  let targetUrl = await shortenURL(`${origin}/advise?inviteCode=${userInfo.inviteCode}&adviseId=${props.adviseId}&title=${props.title}`)

  const shareText = $t('Share Text', { title: props.title, targetUrl })

  let shareUrl = ''
  switch (baseUrl) {
    case `https://t.me/share/url`:

      shareUrl = `${baseUrl}?text=${encodeURIComponent(shareText)}&url=%23TuringMarket`
      break
    case `https://www.x.com/intent/post`:

      shareUrl = `${baseUrl}?text=${encodeURIComponent(shareText)}`
      break
    case `https://www.binance.com/square`:

      shareUrl = `${baseUrl}?text=${encodeURIComponent(shareText)}&url=%23TuringMarket`
      break
  }

  window.open(shareUrl, '_blank')
}
</script>
<template>
  <van-dialog v-model:show="modalIsShow.sharesModal" :title="$t('Share To')" closeable :show-confirm-button="false">
    <div class="w-full pb-2 px-10">
      <div class="flex justify-between w-full py-4">
        <img class="w-12 h-12 bg-cover cursor-pointer transition-transform hover:scale-110"
          src="/assets/img/telegram-2.png" @click="goUrl(`https://t.me/share/url`)" alt="Telegram" />
        <img class="w-12 h-12 bg-cover cursor-pointer transition-transform hover:scale-110" src="/assets/img/x.png"
          @click="goUrl(`https://www.x.com/intent/post`)" alt="X.com" />
        <img class="w-12 h-12 bg-cover cursor-pointer transition-transform hover:scale-110"
          src="/assets/img/binance.png" @click="goUrl(`https://www.binance.com/square`)" alt="Binance" />
      </div>
    </div>
  </van-dialog>
</template>
