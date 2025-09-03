<script setup>
const { userInfo } = $(userStore());
</script>

<template>
   <section class="w-full flex flex-col items-center justify-center bg-white py-2">
      <div class="text-center text-[14px] text-blue-500">{{ $t('20th among all user rankings.') }}</div>

      <div class="w-full px-2 grid grid-cols-4" v-for="n in 10" :key="n">
        <div>avtar</div>
        <div>name</div>
        <div>50</div>
        <div>700 TUIT</div>
      </div>
   </section>
</template>
