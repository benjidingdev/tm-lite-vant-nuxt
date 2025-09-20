<script setup lang="ts">
const { t } = useI18n()
import { showToast } from 'vant'
import type { ShareSheetOption } from 'vant'
import tgImg from '~/assets/icon/telegram.svg'
import xImg from '~/assets/icon/x.svg'
import link from '~/assets/icon/copy-link.svg'

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

type TickerItem = { user: string; points: number; avatar: string }

let inviteTicker = $ref<TickerItem[]>([
  { user: 'Alice', points: 150, avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=1' },
  { user: 'Bob', points: 120, avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=2' },
  { user: 'Charlie', points: 200, avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=3' },
  { user: 'Diana', points: 180, avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=4' },
  { user: 'Eve', points: 160, avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=5' },
  { user: 'Frank', points: 130, avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=6' },
])
const tickerItems = $computed(() => [...inviteTicker, ...inviteTicker])
</script>

<template>
  <van-skeleton :loading="loading" animated class="!px-0">
    <template #template>
      <!-- 骨架屏 -->
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

      <!-- 分享/邀请动机与积分提示 -->
      <div class="rounded-lg bg-[#f7fff5] border border-[#e6f7e9] p-3 flex items-start gap-2">
        <van-icon name="gift-o" color="#16a34a" />
        <div class="text-xs text-gray-600">
          <ul class="list-disc pl-4 mt-1 space-y-0.5">
            <li>{{ t('whyShare.pointsForShare') }}</li>
            <li>{{ t('whyShare.pointsForInvite') }}</li>
            <li>{{ t('whyShare.moreMore') }}</li>
          </ul>
        </div>
      </div>

      <div class="relative overflow-hidden h-28 rounded-md bg-[#fafafa] border border-[#f2f3f5]">
        <ul class="ticker-list py-2">
          <li v-for="(item, idx) in tickerItems" :key="idx" class="ticker-item px-2 flex items-center gap-2">
            <van-image :src="item.avatar" width="18" height="18" round fit="cover" class="shrink-0" />
            <span class="text-xs text-gray-600">
              {{ t('ticker.inviteEarned', { user: item.user, points: item.points }) }}
            </span>
          </li>
        </ul>
      </div>

      <div class="flex gap-3">
        <van-button round size="small" icon="share-o" @click="showShare = true">{{ t('shareActivity') }}</van-button>
        <van-button round size="small" type="success" @click="copyLink">{{ t('copyInviteLink') }}</van-button>
      </div>

      <van-share-sheet v-model:show="showShare" :title="t('shareTo')" :options="shareOptions" @select="onShare" />
    </div>
  </van-skeleton>
</template>

<style scoped>
@keyframes ticker-up {
  0% {
    transform: translateY(0);
  }

  100% {
    transform: translateY(-50%);
  }
}

.ticker-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  animation: ticker-up 14s linear infinite;
}

.ticker-item {
  height: 24px;
  display: flex;
  align-items: center;
  white-space: nowrap;
}
</style>

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
    },
    "whyShare": {
      "pointsForShare": "Share once: +10 points",
      "pointsForInvite": "Each successful invite: +100 points",
      "moreMore": "The more friends you invite, the more points you earn"
    },
    "ticker": {
      "inviteEarned": "{user} invited successfully, +{points} pts"
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
    },
    "whyShare": {
      "pointsForShare": "每分享一次：+100 積分",
      "pointsForInvite": "每成功邀請 1 位朋友：+150 積分",
      "moreMore": "邀請越多，積分越多"
    },
    "ticker": {
      "inviteEarned": "{user} 邀請成功，獲得 {points} 積分"
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
    },
    "whyShare": {
      "pointsForShare": "1回のシェアで：+100 ポイント",
      "pointsForInvite": "1人招待ごとに：+150 ポイント",
      "moreMore": "招待するほどポイントが増えます"
    },
    "ticker": {
      "inviteEarned": "{user} さんが招待に成功、{points} ポイント獲得"
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
    },
    "whyShare": {
      "title": "왜 공유하나요?",
      "pointsForShare": "한 번 공유할 때마다: +100 포인트",
      "pointsForInvite": "친구 1명 초대 성공 시: +150 포인트",
      "moreMore": "많이 초대할수록 더 많은 포인트를 받아요"
    },
    "ticker": {
      "inviteEarned": "{user} 님 초대 성공, {points} 포인트 획득"
    }
  }
}</i18n>
