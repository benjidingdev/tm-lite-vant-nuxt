<script setup>

const { hasTwitterLogin, x_user } = $(supabaseStore())
const route = useRoute()

let { refreshTime } = $(pmDataStore());
let retweetList = $ref([])

const debug = useDebug('retweetList')

let isLoading = $ref(true)
// 0, load user retweet list
async function loadList(params) {
  // if (!hasTwitterLogin) {
  //   return
  // }
  const rz = await doFetch(`/api/topic/${route.params.id}`, {
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
  console.log('retweetList', { retweetList })
  isLoading = false
}

watchEffect(async () => {
  refreshTime;
  await loadList();
})

</script>

<template>
  <section
    class="w-full min-h-100 mt-4 bg-white text-black py-[30px] rounded-[8px] flex flex-col items-center justify-start space-y-2">
    <p class="text-[18px] font-bold mt-2 mb-4 text-gray-600">Retweet List</p>
    <div v-if="isLoading" class="w-full flex-1 flex justify-center items-center">
      <van-loading size="48" />
    </div>

    <template v-else>
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
        <div class="text-[18px] font-bold mr-3 flex items-center">
          <span>{{ user.pAmount || '-' }}</span>
          <van-image class="size-6 ml-1" src="/p.png" />
        </div>
      </div>
    </template>
  </section>
</template>
