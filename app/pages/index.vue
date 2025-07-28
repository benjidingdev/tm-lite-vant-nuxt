<script setup>
import SwipeCard from "@/component/SwipeCard";

import SettingModal from "@/component/SettingModal";

const { setSettingModalShow } = $(uiStore());

const openSettingModal = () => {
  setSettingModalShow(true);
};
</script>

<template>
  <div class="container w-full bg-gradient-to-b from-purple-300 to-blue-300">
    <!--setting board-->
    <div class="h-20 flex items-center justify-between px-10">
      <h1 class="text-3xl text-white">Predict</h1>

      <!-- reown modal -->
      <appkit-button label="Connect" class="mr-8" />
      <!-- hamburger setting -->
      <div
        class="absolute right-5 w-11 h-11 flex flex-col justify-center items-center rounded-full bg-white/20 backdrop-opacity-10 p-3 focus:outline-none"
        @click="openSettingModal"
      >
        <span
          class="block h-0.5 w-6 bg-white transform transition duration-300 ease-in-out"
        ></span>
        <span
          class="block h-0.5 w-5 bg-white mt-1 transform transition duration-300 ease-in-out"
        ></span>
        <span
          class="block h-0.5 w-4 bg-white mt-1 transform transition duration-300 ease-in-out"
        ></span>
      </div>
    </div>
    <!--swipe card-->
    <div class="swipe-card-container px-10 pb-30">
      <SwipeCard />
    </div>

    <!--setting modal-->
    <SettingModal />
  </div>
</template>

<style>
.swipe-card-container {
  height: calc(100vh - 50px); /* Adjust height based on nav bar and tab bar */
}
</style>