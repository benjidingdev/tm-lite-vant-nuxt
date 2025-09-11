<script setup lang="ts">
const { modalIsShow } = $(uiStore());
</script>

<template>
  <van-dialog v-model:show="modalIsShow.tuitModal" :title="$t('Tuit Title')" closeable :show-confirm-button="false">
    <div class="h-[500px] p-4 overflow-y-scroll">
      <ul>
        <li class="font-bold text-base mb-2">{{ $t('Desc Tuit') }}</li>
        <li class="mb-2"> {{ $t('Tuit Desc One') }}</li>
        <li class="mb-2"> {{ $t('Tuit Desc Tow') }} </li>
        <li class="mb-2"> {{ $t('Tuit Desc Three') }} </li>
      </ul>
      <ul>
        <li class="font-bold text-base mb-2"></li>
        <li>
          <p class="font-bold">{{ $t('Tuit Method One') }} </p>
          <p class="mb-2">{{ $t('Method One Desc') }} </p>
        </li>
        <li>
          <p class="font-bold">{{ $t('uit Method Tow') }}</p>
          <p class="mb-2">{{ $t('Method Tow Desc') }}</p>
        </li>
        <li>
          <p class="font-bold">{{ $t('Tuit Method Three') }}</p>
          <p class="mb-2">{{ $t('Method Three Desc') }}</p>
        </li>
      </ul>
      <ul>
        <li class="font-bold text-base mb-2">{{ $t('Tuit Rules') }}</li>
        <li>
          <p class="mb-2 font-bold">{{ $t('Tuit Rules One') }}</p>
          <p class="mb-2">{{ $t('Tuit Rules One Desc') }}</p>
          <p class="mb-2">{{ $t('Tuit Rules One Desc a') }}</p>
          <p class="mb-2">{{ $t('Tuit Rules One Desc b') }}</p>
        </li>
        <li>
          <p class="mb-2 font-bold">{{ $t('Tuit Rules Tow') }}</p>
          <p class="mb-2">{{ $t('Tuit Rules Tow Desc a') }}</p>
          <p class="mb-2">{{ $t('Tuit Rules Tow Desc b') }}</p>
          <p class="mb-2 font-bold">{{ $t('Tuit Rules Three') }}</p>
          <p class="mb-2">{{ $t('Tuit Rules Three Desc a') }}</p>
          <p class="mb-2">{{ $t('Tuit Rules Three Desc b') }}</p>
          <p class="mb-2">{{ $t('Tuit Rules Three Desc c') }}</p>
          <p class="mb-2 font-bold">{{ $t('Tuit Rules Four') }}</p>
          <p class="mb-2">{{ $t('Tuit Rules Four Desc a') }}</p>
          <p class="mb-2">{{ $t('Tuit Rules Four Desc b') }}</p>
        </li>
      </ul>
    </div>
  </van-dialog>
</template>
