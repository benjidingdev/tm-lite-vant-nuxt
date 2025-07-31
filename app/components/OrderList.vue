<template>
  <div class="container w-full">
    <van-card
      v-for="item in list"
      :key="item.id"
      currency="$"
      :price="item.price"
      :desc="item.description"
      :title="item.title"
      :thumb="item.thumb"
    >
      <template #footer>
        <van-button plain size="mini" type="primary">Decrease</van-button>
        <van-button plain size="mini" type="danger">Increase</van-button>
      </template>
    </van-card>
  </div>
</template>
<script setup lang="ts">
const list = $ref([
  {
    id: 1,
    title: "News1",
    description: "U.S. Coca-Cola use cane sugar instead of corn syrup by...?",
    price: 10,
    thumb:
      "https://mallbucket-pub.s3.us-west-1.amazonaws.com/389bf602de5944639a042520b942e307f506d7a121968ed7b504818d1cce99fb.png",
  },
  {
    id: 2,
    title: "News2",
    description: "iPhone 17 series release in ...?",
    price: 20,
    thumb:
      "https://mallbucket-pub.s3.us-west-1.amazonaws.com/4d12996c8f7a762261ae467ca9d03a7725093ff180eaffdab6dc21fc9f08c516.png",
  },
]);
</script>
