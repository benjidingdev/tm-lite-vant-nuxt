<template>
  <van-tabbar v-model="active" safe-area-inset-bottom>
    <van-tabbar-item
      v-for="item in tabList"
      :key="item.name"
      @click="goToLInk(item.path)"
      :icon="item.icon"
    >
      {{ $t(item.name) }}</van-tabbar-item
    >
  </van-tabbar>
</template>

<script setup lang="ts">
const tabList = $ref([
  { name: "Markets", icon: "chart-trending-o", path: "/" },
  { name: "Earn", icon: "balance-o", path: "/earn" },
  { name: "Invite", icon: "hot-o", path: "/invite" },
  { name: "User", icon: "user-o", path: "/user" },
]);
const { locale } = $(useI18n());
const { path } = $(useRoute());

const getLastPath = (path: string) => {
  const paths = path.split("/");
  return paths[paths.length - 1];
};

let active = $computed(() => {
  return tabList.findIndex(
    (item) => getLastPath(path) === getLastPath(item.path)
  );
});

const goToLInk = async (path: string) => {
  const url = locale === "en" ? path : `/${locale}${path}`;
  await navigateTo(url);
};
</script>
