<script setup>
import SwipeCard from "@/component/SwipeCard";
import Navigation from "@/component/Navigation";
</script>

<template>
  <div class="container w-full bg-gradient-to-b from-purple-300 to-blue-300">
    <!--setting board-->
    <Navigation />
    <!--swipe card-->
    <div class="swipe-card-container px-10 pb-30">
      <SwipeCard />
    </div>
  </div>
</template>

<style>
.swipe-card-container {
  height: calc(100vh - 50px); /* Adjust height based on nav bar and tab bar */
}
</style>