<script setup>
definePageMeta({
  layout: "x",
});
</script>

<template>
  <article class="w-full h-full flex flex-col justify-center items-center pt-4">

    <div class="relative w-[320px] rounded-2xl pt-8 pb-6 px-8 bg
      border border-[#16653480] text-center text-white shadow-lg">

      <div class="text-center text-sm text-gray-400">
        Social Card <span class="text-green-500 ml-1">#132093</span>
      </div>

      <div class="mt-4 flex flex-col items-center">
        <div class="h-20 w-20 rounded-full bg-[#354366] flex items-center justify-center text-4xl font-bold">j</div>
        <h2 class="mt-4 text-xl font-bold">john roosevelt</h2>
        <p class="text-sm text-gray-400">@johnroosev18541</p>
      </div>

      <button
        class="mt-8 w-full rounded-full bg-gradient-to-r from-green-500 to-green-700 py-3 font-semibold text-black">
        <div class="flex items-center justify-center space-x-2">
          <svg class="h-5 w-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              d="M11.293 17.293l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z">
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

    <div class="flex flex-col items-center justify-center bg-[#000000] text-white p-2 mt-4">
        <div class="relative flex items-center rounded-xl bg-[#090b0e] p-4 text-sm font-semibold text-gray-400">
          <span class="flex-grow text-left">https://mindoshare.ai/kol?ref=cm...</span>
          <div class="ml-2 flex h-8 w-8 items-center justify-center rounded-lg bg-[#14181a] p-2 text-green-500">
            <svg class="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M19 12h-2v2h-2v-2h-2v2h-2v-2h-2v-2h2V8h2V6h2v2h2V6h2v6zM7 6h2V4H7v2zM5 6h2V4H5v2zM3 6h2V4H3v2zM1 6h2V4H1v2z">
              </path>
            </svg>
          </div>
        </div>

        <button class="mt-2 w-full rounded-full bg-[#1ce4a8] py-4 font-bold text-black">
          <div class="flex items-center justify-center space-x-2">
            <svg class="h-5 w-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm4 11h-3v3h-2v-3H8v-2h3V8h2v3h3z"></path>
            </svg>
            <span>Invite your friends</span>
          </div>
        </button>
    </div>

  </article>
</template>

<style scoped>
.bg {
  background: linear-gradient(153deg, #030b06 7%, #052010 24%, #071b10 31%, #06180f 44%, #05130c 54%, #072114 65%, #083018 86%, #051c0f 98%);
  background-blend-mode: unset;
}
</style>