<script setup>

const { hasTwitterLogin, x_user } = $(supabaseStore())
const route = useRoute()
const { refreshTime } = defineProps(['refreshTime'])

let retweetList = $ref([])

const debug = useDebug('retweetList')

// 0, load user retweet list
async function loadList(params) {
  // if (!hasTwitterLogin) {
  //   return
  // }
  const rz = await doFetch(`/api/pd/topic/${route.params.pid}`, {
    method: 'POST',
    body: JSON.stringify({
      action: 'topic-join_list',
    })
  }).catch((err) => {
    debug({ msg: 'topic-join_list error', err })
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
  <section
    class="w-full min-h-100 mt-4 rounded-[16px] bg-white text-black px-[14px] py-[30px] flex flex-col items-center justify-start space-y-2">
    <div v-if="retweetList.length === 0" class="w-full flex-1 flex justify-center items-center">
      No data.
    </div>
    <div v-for="user in retweetList"
      class="w-full flex items-center justify-between space-x-2 bg-[rgba(0,0,0,0.04)] rounded-[8px] p-[6px]">
      <div class="flex items-center justify-center space-x-2">
        <a :href="`https://x.com/${user.x_profiles?.slug}`" target="_blank">
          <img :src="user.x_profiles.avatar" alt="" class="size-11 rounded-[8px]">
        </a>
        <div>
          <p class="opacity-80 font-[900]">{{ user.x_profiles?.fullname }}</p>
          <p class="text-[14px] opacity-40">
            <!-- {{ user.created_at }} -->
            <NuxtTime :datetime="user.created_at" year="numeric" month="numeric" day="numeric" hour="numeric"
              minute="2-digit" />
          </p>
        </div>
      </div>
      <div class="text-[18px] font-bold mr-3">{{ user.pAmount || '-' }} $PM</div>
    </div>
  </section>
</template>
