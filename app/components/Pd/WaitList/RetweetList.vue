<script setup>

const { hasTwitterLogin } = $(supabaseStore())
const route = useRoute()
const { refreshTime } = defineProps(['refreshTime'])

let retweetList = $ref([])

// 0, load user retweet list
async function loadList(params) {
  if (!hasTwitterLogin) {
    return
  }
  const rz = await doFetch(`/api/pd/topic/${route.params.pid}`, {
    method: 'POST',
    body: JSON.stringify({
      action: 'topic-join_list',
    })
  })

  if (rz?.data?.success) {
    retweetList = rz.data.data
  }
}

watchEffect(() => {
  refreshTime;
  loadList()
})

</script>

<template>
  <div v-for="user in retweetList" class="w-full flex items-end justify-between space-x-2">
    <div class="flex items-center justify-center space-x-2">
      <img :src="user.x_profiles.avatar" alt="">
      <div>
        <p>{{ user.x_profiles?.fullname }}</p>
        <p class="text-gray-300 text-xs">@{{ user.x_profiles?.slug }}</p>
      </div>
    </div>
    <div class="text-xs text-gray-100">{{ '-' }}</div>
  </div>
</template>
