<script setup></script>

<template>
  <!--earn dashboard-->
  <div class="earn-dashboard-container bg-gray-100 inset pt-4">
    <div>
      <van-cell-group inset>
        <van-cell title="TUIT" value="1000" />
      </van-cell-group>
    </div>

    <Task class="rounded-xl" />
  </div>
</template>

<style>
.earn-dashboard-container {
  height: calc(100vh - 130px);
}
</style>
