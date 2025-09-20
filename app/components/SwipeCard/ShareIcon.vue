<script setup lang="ts">
import QrcodeVue from "qrcode.vue";
import {
  SHARE_URL,
  TELEGRAM_SHARE_URL,
  X_SHARE_URL,
  SHARE_MARKET_TEXT
} from "~/types/constant"
import { shortenURL } from '~/utils/shorten'

const props = defineProps<{
  topicInfo: any
}>()

const { t } = useI18n();
const { isSupported, copy, copied } = useClipboard();

const { userInfo } = $(userStore());
const { isInitialized, isLoginIn, login, shareTargetPicker, createUrlBy } = $(liffStore());

const showShare = ref(false);
const showQRCode = ref(false);
const qrcodeContent = ref('');
const options = [
  [
    { name: t('Telegram'), icon: 'https://api.iconify.design/jam:telegram.svg' },
    { name: t('Twitter'), icon: 'https://api.iconify.design/jam:twitter.svg' },
    { name: t('Line'), icon: 'https://api.iconify.design/jam:line.svg' },
  ], [
    { name: t('Copy Link'), icon: 'link' },
    { name: t('Copy Line Link'), icon: 'link' },
    // { name: t('Share Poster'), icon: 'poster' },
    { name: t('QR Code'), icon: 'qrcode' },
  ]
];

const handleShowShare = () => {
  showShare.value = true;
}

const { topicInfo } = props;

function pickRandom<T>(arr: string[]): string | undefined {
  if (!arr.length) return undefined;
  const idx = Math.floor(Math.random() * arr.length);
  return arr[idx];
}

const onSelect = async (option: { name: string, icon: string }) => {
  //showToast(option.name);

  const shareUrl = SHARE_URL('', userInfo?.inviteCode);
  const shortUrl = await shortenURL(shareUrl);
  const shareText = pickRandom(SHARE_MARKET_TEXT(topicInfo.title, topicInfo.markets[0], shortUrl));
  if (!shareText) {
    showToast(t('Share Failed'));
    return;
  }

  switch (option.name) {
    case t('Telegram'):
      window.open(`${TELEGRAM_SHARE_URL(shareText)}`, '_blank');
      break;
    case t('Twitter'):
      window.open(`${X_SHARE_URL(shareText)}`, '_blank');
      break;
    case t('Line'):
      if (isLoginIn) {
        shareTargetPicker([{
          type: 'text',
          text: pickRandom(SHARE_MARKET_TEXT(topicInfo.title, topicInfo.markets[0], await createUrlBy(shareUrl)))
        }], true)
      } else {
        login('');
      }
      break;
    case t('Copy Link'):
      if (isSupported) {
        copy(shareText);
        if (copied) showToast(t('Copied'));
        else showToast(t('Copy Failed'));
      }
      break;
    case t('Copy Line Link'):
      if (isInitialized && isSupported) {
        copy(await createUrlBy(shareUrl));
        if (copied) showToast(t('Copied'));
        else showToast(t('Copy Failed'));
      }
      break;
    // case t('Share Poster'):
    //   break;
    case t('QR Code'):
      showQRCode.value = true;
      qrcodeContent.value = shareUrl;
      break;
  }

  showShare.value = false;
};

const shareCard = () => {
  const { topicInfo } = props;
  const inviteCode = userInfo?.inviteCode || '';
  const params: any = { cardID: topicInfo.id, inviteCode };
  inviteUser(params);
}
</script>

<template>
  <div @click="handleShowShare()" class="cursor-pointer">
    <van-icon name="share-o" />
  </div>

  <van-share-sheet v-model:show="showShare" :options="options" :title="t('Share Now')" description="" @select="onSelect"
    teleport="body" />

  <van-popup v-model:show="showQRCode" :style="{ padding: '24px' }" teleport="body">
    <div class="flex flex-col items-center text-center bg-white rounded-2xl p-6 shadow-lg">
      <div class="text-lg font-semibold mb-3">{{ t('Scan to Join') }}</div>
      <div class="p-[3px] rounded-2xl bg-gradient-to-tr from-blue-400 to-cyan-300">
        <div class="bg-white rounded-xl p-3">
          <QrcodeVue :value="qrcodeContent" :size="140" />
        </div>
      </div>
      <div class="text-sm text-gray-500 mt-3">{{ t('Scan with phone') }}</div>
    </div>
  </van-popup>
</template>
<i18n lang="json">{
  "en-US": {
    "Share Now": "Share Now",
    "Telegram": "Telegram",
    "Twitter": "X",
    "Line": "Line",
    "Copy Link": "Copy Link",
    "Copy Line Link": "Copy Line Link",
    "QR Code": "QR Code",
    "Scan to Join": "Scan to Join",
    "Scan with phone": "Please scan the code with your mobile phone"
  },
  "zh-TW": {
    "Share Now": "立即分享",
    "Telegram": "Telegram",
    "Twitter": "X",
    "Line": "Line",
    "Copy Link": "複製連結",
    "Copy Line Link": "複製 Line 連結",
    "QR Code": "二維碼",
    "Scan to Join": "掃碼參與",
    "Scan with phone": "請使用手機掃碼"
  },
  "ja-JP": {
    "Share Now": "今すぐ共有",
    "Telegram": "Telegram",
    "Twitter": "X",
    "Line": "Line",
    "Copy Link": "リンクのコピー",
    "Copy Line Link": "Line リンクをコピー",
    "QR Code": "2次元コード",
    "Scan to Join": "スキャン参加",
    "Scan with phone": "携帯電話でコードをスキャンしてください"
  },
  "ko-KR": {
    "Share Now": "지금 공유",
    "Telegram": "Telegram",
    "Twitter": "X",
    "Line": "Line",
    "Copy Link": "링크 복사",
    "Copy Line Link": "Line 링크 복사",
    "QR Code": "QR 코드",
    "Scan to Join": "스캔 참여",
    "Scan with phone": "핸드폰으로 코드를 찍으세요."
  }
}</i18n>
