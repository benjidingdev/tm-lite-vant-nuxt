<script setup>

definePageMeta({
  layout: "pdc-default",
});
const { doLogin, x_user } = $(supabaseStore())
let { userAsset } = $(pdcSwipeCardStore())

const login = async () => {
  await doLogin({ pathname: '/market' });
}

const initAsset = async () => {
  let res = await doFetch('/api/assets/initAsset', {
    method: 'POST',
    body: {
      pAmount: 10
    }
  })
  console.log('res', res)
}

const getAsset = async (userId) => {
  let res = await doFetch(`/api/assets/getAsset`, {
    method: 'GET',
  })
  if (res.status === 200) {
    const asset = res?.data?.pAmount || 0;
    userAsset = asset;
  } else {
    userAsset = 0;
  }
  return res;
}

watchEffect(async () => {
  if (!x_user?.id) return;
  await initAsset();
  await getAsset();
})
</script>

<template>
  <div>
    <div class="h-[calc(100dvh)] px-10 flex flex-col justify-center items-center">
      <!--user avatar-->
      <div class="w-full h-16 bg-black-100 flex items-center justify-between">
        <div class="flex justify-center items-center space-x-2">
          <span v-if="x_user.name" class="text-white text-xs">
            <span> {{ x_user.name }}</span>
            <span>{{ ' ' }} </span>
            <span> ${{ userAsset }}</span>
          </span>
          <van-button v-else @click="login">login X</van-button>

        </div>
        <div class="flex justify-center items-center space-x-2">
          <van-image width="30" height="30" :src="x_user.avatar" />
        </div>
      </div>
      <!--swipe card-->
      <SwipeCardPDC />
    </div>
  </div>
</template>
