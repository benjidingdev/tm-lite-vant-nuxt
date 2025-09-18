<script setup>
const emit = defineEmits(['handleBack', 'handleSuccess'])

const route = useRoute()

let submitLoading = $ref(false)
let retweetLink = $ref('')
const disabled = $computed(() => submitLoading || !retweetLink)
// let retweetLink = $ref('https://x.com/John_TuringM/status/1968124413582381493')
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
  })

  // console.log({ rz })
  if (rz.data.success) {
    emit('handleSuccess')
  }
  submitLoading = false
}
</script>

<template v-if="hasRetweetClicked">
  <section class="w-full flex flex-col items-center justify-center space-y-4 bg-[#200052] p-4 rounded-md">
    <p class="text-gray-300 text-xs">
      Then, paste the retweet link above and click submit.
    </p>

    <textarea type="text" v-model="retweetLink" class="w-full border p-2 rounded-md"
      placeholder="Enter your retweet link">
  </textarea>

    <div class="w-full flex justify-between items-center space-x-2">
      <button class="w-full bg-blue-500 text-white px-4 py-2 rounded-md" @click="() => emit('handleBack') ">
        go back
      </button>
      <button :disabled class="w-full text-white px-4 py-2 rounded-md flex items-center justify-center space-x-2"
        :class="disabled ? 'bg-gray-500' : 'bg-blue-500'" @click="handleSubmit">
        <span>submit</span>
        <van-loading size="12" v-if="submitLoading" />
      </button>
    </div>
  </section>
</template>
