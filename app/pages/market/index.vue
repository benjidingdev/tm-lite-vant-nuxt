<script setup>

definePageMeta({
  layout: "pdc-default",
});
const { doLogin, x_user } = $(supabaseStore())
let { userAsset } = $(pdcSwipeCardStore())

const login = async () => {
  await doLogin({ pathname: '/market' });
}

const createAsset = async () => {
  let res = await doFetch('/api/assets/create', {
    method: 'POST',
    body: {
      userId: x_user.id,
      pAmount: 0
    }
  })
  console.log('res', res)
}

const getAsset = async (userId) => {
  let res = await doFetch(`/api/assets/${userId}`, {
    method: 'GET',
  })
  userAsset = res.data;
  return res;
}

const buyYes = async () => {
  userAsset.pAmount -= 5;
  updateAsset(userAsset.pAmount);
}

const buyNo = async () => {
  userAsset.pAmount -= 5;
  updateAsset(userAsset.pAmount);
}

const updateAsset = async (pAmount) => {
  let res = await doFetch('/api/assets/update', {
    method: 'POST',
    body: {
      userId: x_user.id,
      pAmount,
    }
  })
  console.log('updateAsset res', res)
}

watchEffect(async () => {
  if (!x_user?.id) return;
  const res = await getAsset(x_user.id);
  console.log('res', res)
  if (res.status === 200 && Array.isArray(res.data) && res.data.length > 0) return;
  createAsset();
})
</script>

<template>
  <div>
    <div class="h-[calc(100dvh)] px-10 flex flex-col justify-center items-center">
      <!--user avatar-->
      <div class="w-full h-16 bg-black-100 flex items-center justify-between px-4">
        <div class="flex justify-center items-center space-x-2">
          <span v-if="x_user.name" class="text-white text-xs">
            <span> {{ x_user.name }}</span>
            <span>{{ ' ' }} </span>
            <span> ${{ userAsset.pAmount }}</span>
          </span>
          <van-button v-else @click="login">login X</van-button>
        </div>
        <div class="flex justify-center items-center space-x-2">
          <van-image width="30" height="30" :src="x_user.avatar" />
        </div>
      </div>

      <!--update assets-->
      <div class="mt-5">
        <van-button @click="buyYes">Buy yes</van-button>
        <van-button @click="buyNo">Buy no</van-button>
      </div>
      <!--swipe card-->
      <SwipeCardPDC />
    </div>
  </div>
</template>
