<script setup lang="ts">
import { mergeProps } from 'vue';
import type { ExtractPropTypes } from 'vue';
import type {
  ShareSheetProps,
  ShareSheetOption,
} from 'vant';

const props = defineProps<ExtractPropTypes<ShareSheetProps>>()

const options: ShareSheetOption[] = [
  { name: '微信', icon: 'wechat' },
  { name: '微博', icon: 'weibo' },
  { name: '复制链接', icon: 'link' },
];

const onShare = (opt: ShareSheetOption) => {
  // debugger
}
</script>

<template>
  <van-share-sheet v-bind="mergeProps($attrs, props)" v-model:show="props.show" :options="options" @select="onShare"/>
</template>
