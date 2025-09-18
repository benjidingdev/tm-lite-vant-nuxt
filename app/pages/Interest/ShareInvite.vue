<script setup lang="ts">
const { t } = useI18n()
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
  [{ name: 'telegram', icon: tgImg }, { name: 'X', icon: xImg }, { name: t('option.copyLink'), icon: link }],
])

const onShare = (opt: ShareSheetOption) => {
  showToast(t('toast.selected', { name: opt.name as string }))
  if (opt.name === 'X') {
    window.open(`https://www.x.com/intent/post?text=${encodeURIComponent(t('share.postText'))}`, '_blank')
  } if (opt.name === 'telegram') {
    window.open(`https:t.me/share/url?text=${encodeURIComponent(t('share.postText'))}`, '_blank')
  }
  showShare = false
}

const copyLink = async () => {
  try {
    const url = `${location.origin}/invite?ref=demo-user`
    await navigator.clipboard.writeText(url)
    showToast(t('toast.copied'))
  } catch {
    showToast(t('toast.copyFail'))
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
        <div class="text-sm text-gray-700">{{ t('sectionTitle') }}</div>
        <div class="text-xs text-gray-500">{{ t('dailyCap', { cap: '1,000' }) }}</div>
      </div>

      <div class="flex items-center overflow-x-auto scrollbar-hidden gap-3 py-1">
        <van-image v-for="(u, i) in shareUsers" :key="i" :src="u.avatar" width="40" height="40" round fit="cover"
          class="shrink-0 object-cover" />
      </div>

      <div class="flex gap-3">
        <van-button round size="small" icon="share-o" @click="showShare = true">{{ t('shareActivity') }}</van-button>
        <van-button round size="small" type="success" @click="copyLink">{{ t('copyInviteLink') }}</van-button>
      </div>

      <van-share-sheet v-model:show="showShare" :title="t('shareTo')" :options="shareOptions" @select="onShare" />
    </div>
  </van-skeleton>
</template>

<i18n lang="json">{
  "en-US": {
    "sectionTitle": "Share & Invite",
    "dailyCap": "Daily share points cap {cap}",
    "shareActivity": "Share Campaign",
    "copyInviteLink": "Copy invite link",
    "shareTo": "Share to",
    "option": {
      "copyLink": "Copy link"
    },
    "toast": {
      "selected": "Selected: {name}",
      "copied": "Link copied",
      "copyFail": "Copy failed, please copy manually"
    },
    "share": {
      "postText": "Hello, welcome"
    }
  },
  "zh-TW": {
    "sectionTitle": "分享與邀請",
    "dailyCap": "今日分享積分上限 {cap}",
    "shareActivity": "分享活動",
    "copyInviteLink": "複製邀請連結",
    "shareTo": "分享至",
    "option": {
      "copyLink": "複製連結"
    },
    "toast": {
      "selected": "選擇：{name}",
      "copied": "連結已複製",
      "copyFail": "複製失敗，請手動複製"
    },
    "share": {
      "postText": "你好，歡迎"
    }
  },
  "ja-JP": {
    "sectionTitle": "シェアと招待",
    "dailyCap": "本日のシェアポイント上限 {cap}",
    "shareActivity": "キャンペーンをシェア",
    "copyInviteLink": "招待リンクをコピー",
    "shareTo": "共有先",
    "option": {
      "copyLink": "リンクをコピー"
    },
    "toast": {
      "selected": "選択：{name}",
      "copied": "リンクをコピーしました",
      "copyFail": "コピーに失敗しました。手動でコピーしてください"
    },
    "share": {
      "postText": "こんにちは、ようこそ"
    }
  },
  "ko-KR": {
    "sectionTitle": "공유 및 초대",
    "dailyCap": "오늘 공유 포인트 한도 {cap}",
    "shareActivity": "이벤트 공유",
    "copyInviteLink": "초대 링크 복사",
    "shareTo": "공유 대상",
    "option": {
      "copyLink": "링크 복사"
    },
    "toast": {
      "selected": "선택: {name}",
      "copied": "링크가 복사되었습니다",
      "copyFail": "복사에 실패했습니다. 직접 복사해 주세요"
    },
    "share": {
      "postText": "안녕하세요, 환영합니다"
    }
  }
}</i18n>
