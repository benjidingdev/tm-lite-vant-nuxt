<script setup>
const emit = defineEmits(['onSuccess'])
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
  handleRetweet({
    hashtags: topic.meta?.x_info?.hashtags,
    retweetTargetUrl: topic.meta?.x_info?.retweetTargetLink,
    text: topic.meta?.x_info?.text,
    refId: x_user.id,
    title: topic.title,
  })
  hasRetweetClicked = true
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
    text = 'Then, paste the retweet link above and click submit.'
  } else {
    text = 'First, click the retweet button below to retweet the topic tweet and paste the retweet link below.'
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
        <p class="opacity-80 text-[20px]">{{ x_user?.name }}</p>
        <p class="text-[14px] opacity-60">@{{ x_user?.user_name }}</p>
      </div>
      <div class="flex items-center justify-center space-x-1 bg-[rgba(112,0,255,0.1)] rounded-[8px] px-3 py-1">
        <van-image class="size-6 ml-1" src="/icons/btc.svg" />
        <div class="font-bold">${{ pAmount }}</div>
      </div>
    </div>

    <TopicWaitListCompleted :topic v-if="hasRetweeted" />
    <template v-else>

      <p class="opacity-60 text-[14px] mt-8 mb-7">
        {{ descText }}
      </p>

      <TopicWaitListSubmitRetweetUrl v-if="hasRetweetClicked" @onBack="() => { hasRetweetClicked = false }"
        @onSuccess="() => { hasRetweeted = true; emit('onSuccess') }" />

      <template v-else>

        <div class="w-full flex justify-between items-center mb-[15px]">
          <button class="w-full bg-[#7000FF] h-11 rounded-[8px]" @click="onClickRetweet"
            style="box-shadow: 0px 12px 32px -8px rgba(112,0,255,0.5);">
            <text class="text-white font-[900]">Retweet</text>
          </button>
        </div>
      </template>
    </template>
  </section>
</template>
