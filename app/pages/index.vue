<template>
  <div>
    <!--swipe card-->
    <div class="swipe-card-container px-10 pb-30">
      <SwipeCard />
    </div>
  </div>
</template>

<script setup />

<style>
.swipe-card-container {
  height: calc(100vh - 150px);
  /* Adjust height based on nav bar and tab bar */
}
</style>
