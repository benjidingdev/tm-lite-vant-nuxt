<template>
  <article class="w-screen h-[calc(100dvh)] overflow-y-scroll text-white relative bg">
      <slot />
  </article>
</template>

<style scoped>
.bg {
  background: #000;
  background-image: radial-gradient(ellipse 100% 70% at 50% -10%, #00ff9936, transparent);
}
</style>
