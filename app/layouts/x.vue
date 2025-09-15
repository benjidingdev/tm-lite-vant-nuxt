<template>
  <article class="w-screen h-[calc(100dvh)] overflow-y-scroll text-white relative bg">
      <slot />
  </article>
</template>

<style scoped>
.bg {
  background: #0e100f;
  background-image: radial-gradient(ellipse 80% 40% at 50% -10%, #200052, transparent);
}
</style>
