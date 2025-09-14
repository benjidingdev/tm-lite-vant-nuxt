<script setup>
const { user = {} } = defineProps(['user'])
</script>

<template>
  <div id="my-div" class="relative w-[320px] rounded-2xl pt-8 pb-6 px-8 bg
      border border-[#16653480] text-center text-white shadow-lg">

    <div class="text-center text-sm text-gray-400">
      Social Card <span class="text-green-500 ml-1">#132093</span>
    </div>

    <div class="mt-4 flex flex-col items-center">
      <div class="h-20 w-20 rounded-full bg-[#354366] flex items-center justify-center overflow-hidden">
        <img :src="user.avatar" alt="" class="w-full h-full">
      </div>
      <h2 class="mt-4 text-xl font-bold">{{ user.name }}</h2>
      <p class="text-sm text-gray-400">@{{ user.user_name }}</p>
    </div>

    <!-- <img
        src="https://mallbucket-pub.s3.us-west-1.amazonaws.com/d4278b107c70ba2c9f7e0fc23bf9647abb9f670c1b7fc958b6e1efcbb62a6693.png"
        class="w-full h-auto" alt=""> -->

    <button class="mt-8 w-full rounded-full bg-gradient-to-r from-green-500 to-green-700 py-3 font-semibold text-black">
      <div class="flex items-center justify-center space-x-2">
        <svg class="h-5 w-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M11.293 17.293l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z">
          </path>
        </svg>
        <span>turing</span>
      </div>
    </button>

    <div class="mt-8 grid grid-cols-2 gap-y-6">
      <div>
        <h3 class="text-4xl font-semibold">2</h3>
        <p class="text-xs text-gray-400">Followers</p>
      </div>
      <div>
        <h3 class="text-4xl font-semibold">-</h3>
        <p class="text-xs text-gray-400">KOL Score</p>
      </div>
      <div>
        <h3 class="text-4xl font-semibold">0.04</h3>
        <p class="text-xs text-gray-400">Wallet Score</p>
      </div>
      <div>
        <h3 class="text-4xl font-semibold">-</h3>
        <p class="text-xs text-gray-400">Engagement</p>
      </div>
    </div>

    <div class="mt-8">
      <span class="text-green-500 text-sm font-semibold">Points Boost x1.0</span>
    </div>

  </div>
</template>
