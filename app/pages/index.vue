<template>
  <div>
    <!--swipe card-->
    <div class="swipe-card-container px-10">
      <SwipeCard />
    </div>
  </div>
</template>

<script setup />

<style>
.swipe-card-container {
  height: calc(100vh - 130px);
  /* Adjust height based on nav bar and tab bar */
}
</style>
