<script setup>
const { t } = useI18n()
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
    class="w-full min-h-100 bg-white text-black py-[30px] rounded-[8px] flex flex-col items-center justify-start space-y-2">
    <div class="w-full border-t border-gray-100 mb-8"></div>
    <div class="flex text-sm justify-between items-center w-full pb-2 text-gray-600">
      <div class=" font-bold">{{ t('Retweet List') }}</div>
      <div class="">{{ t('Total Earn') }}</div>
    </div>
    <div v-if="isLoading" class="w-full flex-1 flex justify-center items-center">
      <van-loading size="48" />
    </div>

    <template v-else>
      <div v-if="retweetList.length === 0" class="w-full flex-1 flex justify-center items-center">
        No data.
      </div>
      <div v-for="user in retweetList"
        class="w-full flex items-center justify-between space-x-2 bg-purple-100 rounded-[8px] p-[6px]">
        <div class="flex items-center justify-center space-x-2">
          <a :href="`https://x.com/${user.x_profiles?.slug}`" target="_blank">
            <img :src="user.x_profiles.avatar" alt="" class="size-11 rounded-full">
          </a>
          <div>
            <p class="opacity-80 font-bold text-sm">{{ user.x_profiles?.fullname }}</p>
            <p class="text-xs opacity-40">
              <NuxtTime :datetime="user.created_at" year="numeric" month="numeric" day="numeric" hour="numeric"
                minute="2-digit" />
            </p>
          </div>
        </div>
        <div class="font-bold mr-3 flex items-center">
          <van-image class="size-6 mr-1" src="/p.png" round />
          <span>${{ user.pAmount || '0' }}</span>
        </div>
      </div>
    </template>
  </section>
</template>
