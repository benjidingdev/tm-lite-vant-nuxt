<script setup lang="ts">
import {
  telegram_bot_app_url,
  telegram_bot_group_url,
  telegram_share_url,
  replacePlaceholders
} from "~/utils/inviteUtils";
import { showSuccessToast, showFailToast } from "vant";

const { t } = useI18n();
const { copy, copied, text } = useClipboard();
const { botUsername, isInitialized, startParams, initData, initDataUnsafe, version, platform, sendData, openLink, openTelegramLink } = $(tgStore());
const { userInfo } = $(userStore());

const shareText = "Turing Market has a topic of, Claim the reward via {{url}}"
const shareUrl = computed(() => {
  const text = replacePlaceholders(shareText, { url: telegram_bot_app_url(botUsername, { redirect: "/test/tg", inviteCode: userInfo?.inviteCode }) })
  return `${telegram_share_url(text)}`
})
const startGroupUrl = computed(() => {
  return telegram_bot_group_url(botUsername, { inviteCode: userInfo?.inviteCode })
})

const handleCopy = (text: string) => {
  copy(text)
  showSuccessToast({ message: t('Copied!') })
}
</script>
<template>
  <div class="h-screen pb-15 !text-[#fff] overflow-y-auto" style="padding-bottom: 150px;">
    <van-form>
      <van-cell-group inset :title="t('TG Test')">
        <van-cell is-link :title="t('Initialized')" :label="isInitialized.toString()" />
        <van-cell is-link :title="t('InitData')" :label="JSON.stringify(initData())" @click="handleCopy(JSON.stringify(initData()))" />
        <van-cell is-link :title="t('InitDataUnsafe')" :label="JSON.stringify(initDataUnsafe())" @click="handleCopy(JSON.stringify(initDataUnsafe()))" />
        <van-cell is-link :title="t('StartParams')" :label="JSON.stringify(startParams)" @click="handleCopy(JSON.stringify(startParams))" />
        <van-cell is-link :title="t('version')" :label="version()" />
        <van-cell is-link :title="t('platform')" :label="platform()" />
      </van-cell-group>
      <van-cell-group inset :title="t('TG Actions')">
        <van-cell is-link :title="t('SendData')" @click="sendData('test')" />
        <van-cell is-link :title="t('OpenLink')" @click="openLink(shareUrl)" />
        <van-cell is-link :title="t('OpenTelegramLink')" @click="openTelegramLink(shareUrl)" />
        <van-cell is-link :title="t('StartGroup')" @click="openTelegramLink(startGroupUrl)" />
      </van-cell-group>
    </van-form>
  </div>
</template>
<i18n lang="json">{
  "en-US": {
    "Hello Local": "Hello Local"
  },
  "zh-TW": {
    "Hello Local": "汝好 Local"
  },
  "ja-JP": {
    "Hello Local": "こんにちは、ローカル!"
  },
  "ko-KR": {
    "Hello Local": "你好 Local"
  }
}</i18n>
