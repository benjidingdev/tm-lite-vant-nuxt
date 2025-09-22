<script setup lang="ts">
import {
  telegram_bot_app_url,
  telegram_bot_group_url,
  telegram_share_url
} from "~/utils/inviteUtils"

const { t } = useI18n();
const { botUsername, isInitialized, initData, initDataUnsafe, version, platform, sendData, openLink, openTelegramLink } = $(tgStore());
const { userInfo } = $(userStore());

const shareText = "Turing Market has a topic of, Claim the reward via {{url}}"
const shareUrl = computed(() => {
  const text = replacePlaceholders(shareText, { url: telegram_bot_app_url(botUsername, { inviteCode: userInfo?.inviteCode }) })
  return `${telegram_share_url(text)}`
})
const startGroupUrl = computed(() => {
  return telegram_bot_group_url(botUsername, { inviteCode: userInfo?.inviteCode })
})

function replacePlaceholders(text: string, variables: Record<string, string>) {
  return text.replace(/\{\{(\w+)\}\}/g, (match, key) => variables[key] || match);
}

</script>
<template>
  <div class="h-screen pb-15 !text-[#fff] overflow-y-auto" style="padding-bottom: 150px;">
    <van-form>
      <van-cell-group inset :title="t('TG Test')">
        <van-cell is-link :title="t('Initialized')" :label="isInitialized.toString()" />
        <van-cell is-link :title="t('InitData')" :label="JSON.stringify(initData())" />
        <van-cell is-link :title="t('InitDataUnsafe')" :label="JSON.stringify(initDataUnsafe())" />
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
