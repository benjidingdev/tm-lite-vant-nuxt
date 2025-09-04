<script setup>

</script>

<template>
  <section class="sticky top-0 z-10">
    <van-notice-bar left-icon="volume-o" :scrollable="false">
      <van-swipe vertical class="notice-swipe h-[40px] leading-10" :autoplay="3000" :touchable="false"
        :show-indicators="false">
        <van-swipe-item>User1 got 1000 TUIT invited AAA successfully!</van-swipe-item>
        <van-swipe-item>User1 got 1000 TUIT invited BBB successfully!</van-swipe-item>
        <van-swipe-item>User1 got 1000 TUIT invited CCC successfully!</van-swipe-item>
      </van-swipe>
    </van-notice-bar>
  </section>
</template>
