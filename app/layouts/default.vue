<template>
  <!--data loading-->
  <ConfigLoad />
  <div class="container w-full bg-gradient-to-b from-purple-400 to-blue-400">
    <Navigation />
    <div>
      <slot />
    </div>
    <TabBar />
  </div>
</template>
