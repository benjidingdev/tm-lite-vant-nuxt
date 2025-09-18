<script setup>
defineProps({
  value: {
    type: Array,
    default: () => [],
  },
  button: {
    type: Array,
    default: () => [],
  },
  active: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['click'])

const handleClick = (ind) => {
  emit('click', ind)
}
</script>
<template>
  <div class="w-full">
    <van-row class="flex justify-between items-center px-6 pt-4">
      <template v-for="(item, ind) in value">
        <van-col v-if="ind > 0" class="flex-1 h-5 opacity-10 bg-white mb-4 lg:mb-5" />
        <van-image class="w-10 lg:!w-16 scale-140"
          :src="ind === active ? '/campaign/circle_green.svg' : ind < active ? '/campaign/circle_black.svg' : '/campaign/circle_white.svg'">
          <van-image v-if="ind < active" class="!absolute top-1.5 lg:top-3 left-3 lg:left-5.5 h-4.5 lg:!h-5.5" src="/campaign/complete.png" />
          <span v-else class="font-dinpro !absolute top-0.5 lg:top-3 left-2.5 lg:left-5.5 font-black" :class="[ind===active ? 'text-white' : 'text-[#93DF18]']">0{{ ind + 1 }}</span>
        </van-image>
      </template>
    </van-row>
    <van-row class="flex justify-between mt-1 lg:mt-3 px-2 lg:px-0">
      <van-col v-for="(item, ind) in value" class="w-18 lg:w-28 text-sm text-center font-bold font-roboto"
        :class="ind === active ? 'text-[#93DF18]' : ind < active ? 'text-white opacity-50' : 'text-white'">
        <p>{{ item }}</p>
        <van-button v-if="ind === active && button.length" class="!h-8.5 !border-0 !rounded-full !bg-[#B3FF26] !mt-2" @click="handleClick(ind)">{{ button[ind] }}</van-button>
      </van-col>
    </van-row>
  </div>
</template>
