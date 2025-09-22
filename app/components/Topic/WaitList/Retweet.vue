<script setup>
const emit = defineEmits(['onSuccess'])
const t = useI18n().t
const { x_user } = $(supabaseStore())
let { pAmount } = $(pmDataStore())
const hasRetweeted = $(defineModel())
const { topic } = defineProps({
  topic: {
    type: Object,
    default: () => { },
  }
})
let hasRetweetClicked = $ref(false)

function onClickRetweet() {
  const shareText = topic.meta?.x_info?.text;
  if (shareText) {
    const text = replacePlaceholders(shareText, { url: web_share_url("", { refId: x_user.id }), title: topic.title });
    const url = x_share_url(text, topic.meta?.x_info?.retweetTargetLink, topic.meta?.x_info?.hashtags);
    window.open(url, "_blank");
    hasRetweetClicked = true
  }
}

const getAsset = async () => {
  let res = await doFetch(`/api/assets/getAsset`, {
    method: 'GET',
  })
  if (res.status === 200) {
    const asset = res?.data?.pAmount || 0;
    pAmount = asset;
  } else {
    pAmount = 0;
  }
  return res;
}

const descText = $computed(() => {
  let text

  if (hasRetweetClicked) {
    text = t('Then, paste the retweet link above and click submit.')
  } else {
    text = t('First, click the retweet button below to retweet the topic tweet and paste the retweet link below.')
  }
  return text
})

onMounted(() => {
  getAsset();
})

</script>

<template>
  <section
    class="w-full flex flex-col items-center justify-center space-y-4 bg-white p-5 rounded-[16px] mt-5 text-black">
    <div class="w-full flex items-center justify-center space-x-[14px]">
      <img :src="x_user?.avatar" alt="logo" class="size-11 rounded-[8px]">
      <div class="flex-1">
        <p class="opacity-80 text-md">{{ x_user?.name }}</p>
        <p class="text-[14px] opacity-60">@{{ x_user?.user_name }}</p>
      </div>
      <div class="flex items-center justify-center space-x-1 bg-[rgba(112,0,255,0.1)] rounded-[8px] px-3 py-1">
        <van-image class="size-6 ml-1" src="/p.png" round />
        <div class="font-bold">${{ pAmount }}</div>
      </div>
    </div>
    <template v-if="hasRetweeted">
      <TopicWaitListCompleted :topic />
    </template>
    <div v-else class="my-20 w-full">
      <TopicWaitListSubmitRetweetUrl v-if="hasRetweetClicked" @onBack="() => { hasRetweetClicked = false }"
        @onSuccess="() => { hasRetweeted = true; emit('onSuccess') }" />
      <div v-else class="w-full flex justify-between items-center mb-[15px]">
        <button class="w-full bg-[var(--turing-purple-color)] h-11 rounded-[8px]" @click="onClickRetweet">
          <text class="text-white font-[900]">{{ t('Retweet to get x Points', {
            reward: topic?.meta?.rewards?.retweet || 0
          })
            }}</text>
          </button>
        </div>
    </div>
    <TopicWaitListRetweetList />
  </section>
</template>
<i18n>
{
  "en": {
    "Retweet to get x Points": "Retweet to get {reward} Points",
    "First, click the retweet button below to retweet the topic tweet and paste the retweet link below.": "First, click the retweet button below to retweet the topic tweet and paste the retweet link below.",
    "Then, paste the retweet link above and click submit.": "Then, paste the retweet link above and click submit."
  }
}
</i18n>
