<script setup>
const emit = defineEmits(['handleClick'])
const { x_user } = $(supabaseStore())
const { hasRetweeted } = defineProps(['hasRetweeted'])

const route = useRoute()

const sharedTopic = topics()
const topic = $computed(() => sharedTopic.find(t => t.id === Number(route.params.pid)))

function handleShare() {
  if (!x_user.id) {
    return
  }
  let shareLink = new URL(location.href);
  shareLink.searchParams.append('refId', x_user.id)
  shareLink = shareLink.toString()
  const text = `Turing Market has a topic of ${topic.title} ,Join the waitlist via ${shareLink}`;

  handleRetweet({
    hashtags: 'TuringM,TuringMaster,Airdrop',
    shareTweetStatusLink: 'https://x.com/TuringMarket/status/1958786009753428017',
    text
  })

  emit('handleClick')
}

</script>

<template>
  <section class="w-full flex flex-col items-center justify-center space-y-4 bg-[#200052] p-4 rounded-md">
    <div class="flex items-center justify-center space-x-2">
      <img :src="x_user?.avatar" alt="logo" class="w-12 h-12">
      <div>
        <p>{{ x_user?.name }}</p>
        <p class="text-gray-400 text-xs">@{{ x_user?.user_name }}</p>
      </div>
    </div>
    <p class="text-gray-300 text-xs">
      {{ hasRetweeted ? 'You have retweeted this topic' : 'First, click the retweet button below to retweet the topic tweet and paste the retweet link below.' }}
    </p>

    <div class="w-full flex justify-between items-center space-x-2">
      <button class="w-full bg-blue-500 text-white px-4 py-2 rounded-md" @click="handleShare">
        retweet
      </button>
    </div>
  </section>
</template>
