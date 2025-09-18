<template>
  <article class="w-screen h-dvh overflow-x-hidden overflow-y-scroll text-white relative bg">
    <slot />
  </article>
</template>

<style scoped>
.bg {
  background: #141414;
  background-image: radial-gradient(ellipse 80% 40% at 90% -20%, #7000FF, transparent),
  radial-gradient(ellipse 80% 40% at -20% 95%, #7000FF, transparent);
  /* &::before {
    content: '';
    position: absolute;
    top: 80%;
    left: -80%;
    width: 100dvw;
    height: 100dvh;
    background: linear-gradient( 264deg, #7000FF 0%, #06FFF0 100%);
    rotate: 255deg;
    border-radius: 0px 0px 0px 0px;
    filter: blur(267.9403076171875px);
  } */
}
</style>
