<script setup lang="ts">
import { useRouteQuery } from '@vueuse/router'

const route = useRoute()
const { t } = useI18n()
let show = $ref(false);
const { topic } = $(pmDataStore())
const { x_user, hasTwitterLogin, doLogin } = $(supabaseStore())

const actions = computed(() => {
  if (hasTwitterLogin) {
    return [
      { icon: '/icons/rank.svg', name: t('Back to Topic'), subname: t('Back to topic home page'), callback: () => useNavigateTo(`/t-${route.params.id}`) },
      { icon: '/download.webp', name: t('Download Phote'), subname: t('Download rank wall to a picture'), callback: onClickDownload },
      { icon: '/x.webp', name: t('Share on X'), subname: t('Share rank wall link to inivite friends'), callback: onClickShareX }
    ]
  }
  return [
    { icon: '/icons/rank.svg', name: t('Back to Topic'), subname: t('Back to topic home page'), callback: () => useNavigateTo(`/t-${route.params.id}`) },
    { icon: '/x.webp', name: t('Auth with X'), subname: t('Auth you X account to login'), callback: handleLogin },
  ]
})

const onSelect = (item: any) => {
  console.log('item', item)
  show = false;
  // useNavigateTo(item.to)
};

async function onClickDownload() {
  const target = document.getElementById('share-download');
  await captureTargetToPng('shareImageName', target);
}

function onClickShareX() {
  // console.log('topic', topic)
  handleRetweet({
    hashtags: topic.meta?.x_info?.hashtags,
    retweetTargetUrl: topic.meta?.x_info?.retweetTargetLink,
    text: topic.meta?.x_info?.shareRankText,
    refId: x_user.id,
    title: topic.title,
  })
}

async function handleLogin() {
  const query = new URLSearchParams(location.search)
  const refId = query.get('refId')
  await doLogin({ pathname: location.pathname, refId, reason: `topic-${route.params.id}` })
}

</script>
<template>
  <van-floating-bubble axis="xy" icon="share" magnetic="x" @click="show = true" />
  <van-action-sheet v-model:show="show" :actions @select="onSelect" :cancel-text="$t('Cancel')" />
</template>
