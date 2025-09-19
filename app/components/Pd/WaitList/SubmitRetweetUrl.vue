<script setup>

const { x_user } = $(supabaseStore())

const emit = defineEmits(['onBack', 'onSuccess'])

const route = useRoute()

const debug = useDebug('submitRetweetUrl')
let submitLoading = $ref(false)
let retweetLink = $ref('')
// let retweetLink = $ref('https://x.com/John_TuringM/status/1968124413582381493')
const disabled = $computed(() => submitLoading || !retweetLink || !retweetLink.startsWith(`https://x.com/${x_user?.user_name}`))

async function handleSubmit() {
  if (!retweetLink) {
    return
  }

  submitLoading = true
  const rz = await doFetch(`/api/pd/topic/${route.params.pid}`, {
    method: 'POST',
    body: JSON.stringify({
      retweetLink,
      action: 'topic-join',
    })
  }).catch((err) => {
    debug({ msg: 'topic-join error', err })
  })

  // console.log({ rz })
  if (rz?.data?.success) {
    emit('onSuccess')
  }

  // emit('onSuccess')

  submitLoading = false
}
</script>

<template>
  <textarea type="text" name="retweetLink" v-model="retweetLink"
    class="w-full border-1 px-4 py-3 rounded-md border-gray-500 focus:border-[#7000FF]"
    placeholder="Enter your retweet link">
  </textarea>

  <div class="w-full flex flex-col justify-between items-center space-y-4">
    <button :disabled class="w-full text-white px-4 py-2 rounded-md flex items-center justify-center space-x-2"
      :class="disabled ? 'bg-gray-500' : 'bg-[#7000FF] active'" @click="handleSubmit">
      <span class="text-white font-[900]">submit</span>
      <van-loading size="12" v-if="submitLoading" />
    </button>

    <button class="w-full border-1 border-[#353535] px-4 py-2 rounded-md" @click="() => emit('onBack')">
      <span class="font-[900]">back</span>
    </button>
  </div>
</template>

<style>
.active {
  box-shadow: 0px 12px 32px -8px rgba(112, 0, 255, 0.5);
}
</style>
