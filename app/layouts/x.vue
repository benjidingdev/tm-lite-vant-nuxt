<template>
  <section class="w-screen h-screen overflow-y-scroll text-white bg">
      <slot />
  </section>
</template>

<style scoped>
.bg {
  background: #000;
  background-image: radial-gradient(ellipse 100% 70% at 50% -10%, #00ff9936, transparent);
}
</style>
