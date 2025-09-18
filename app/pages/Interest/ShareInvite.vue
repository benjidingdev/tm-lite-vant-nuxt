<script setup lang="ts">
import { showToast } from 'vant'
import type { ShareSheetOption } from 'vant'
import tgImg from '~/assets/icon/telegram.svg'
import xImg from '~/assets/icon/x.svg'
import link from '~/assets/icon/copy-link.svg'

let shareUsers = $ref(
  Array.from({ length: 12 }).map((_, i) => ({
    avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${i + 1}`,
  }))
)

let showShare = $ref(false)
let shareOptions = $ref<ShareSheetOption[][]>([
  [{ name: 'telegram', icon: tgImg }, { name: 'X', icon: xImg }, { name: '复制链接', icon: link }],
])

const onShare = (opt: ShareSheetOption) => {
  showToast(`选择：${opt.name}`)
  if (opt.name === 'X') {
    window.open(`https://www.x.com/intent/post?text=${encodeURIComponent('hello welcome')}`, '_blank')
  } if (opt.name === 'telegram') {
    window.open(`https:t.me/share/url?text=${encodeURIComponent('hello welcome')}`, '_blank')
  }
  showShare = false
}

const copyLink = async () => {
  try {
    const url = `${location.origin}/invite?ref=demo-user`
    await navigator.clipboard.writeText(url)
    showToast('链接已复制')
  } catch {
    showToast('复制失败，请手动复制')
  }
}

let loading = $ref(true)
setTimeout(() => {
  loading = false
}, 1000)
</script>

<template>
  <van-skeleton :loading="loading" animated class="!px-0">
    <template #template>
      <div class="w-full rounded-xl bg-white border border-[#f0f0f0] p-4 shadow-sm space-y-3">
        <div class="flex items-center justify-between">
          <div class="h-3 w-24 bg-[#f2f3f5] rounded" />
          <div class="h-3 w-36 bg-[#f2f3f5] rounded" />
        </div>

        <div class="flex items-center overflow-x-auto gap-3 py-1 scrollbar-hidden">
          <div v-for="i in 8" :key="i" class="w-10 h-10 rounded-full bg-[#f2f3f5] shrink-0" />
        </div>

        <div class="flex gap-3">
          <div class="h-8 w-24 bg-[#f2f3f5] rounded-full" />
          <div class="h-8 w-28 bg-[#f2f3f5] rounded-full" />
        </div>
      </div>
    </template>

    <div class="rounded-xl bg-white border border-[#f0f0f0] p-4 shadow-sm space-y-3">
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-700">分享与邀请</div>
        <div class="text-xs text-gray-500">今日分享积分上限 1,000</div>
      </div>

      <div class="flex items-center overflow-x-auto scrollbar-hidden gap-3 py-1">
        <van-image v-for="(u, i) in shareUsers" :key="i" :src="u.avatar" width="40" height="40" round fit="cover"
          class="shrink-0 object-cover" />
      </div>

      <div class="flex gap-3">
        <van-button round size="small" icon="share-o" @click="showShare = true">分享活动</van-button>
        <van-button round size="small" type="success" @click="copyLink">复制邀请链接</van-button>
      </div>

      <van-share-sheet v-model:show="showShare" title="分享至" :options="shareOptions" @select="onShare" />
    </div>
  </van-skeleton>
</template>
