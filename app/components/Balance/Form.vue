<script setup lang="ts">
import { useCustomFieldValue } from "@vant/use";

const props = defineProps({
  modelValue: {
    type: [String, Number],
    required: true,
  },
  name: {
    type: [String],
    required: true,
  },
  label: {
    type: [String],
    required: false,
    default: "",
  },
  placeholder: {
    type: [String],
    required: false,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

const dynamicModel = $computed({
  get: () => props.modelValue,
  set: (newValue) => {
    emit("update:modelValue", newValue);
  },
});

useCustomFieldValue(() => dynamicModel);
</script>

<template>
  <div class="flex flex-col gap-1 w-full">
    <label class="font-bold" :for="name">{{ label }}</label>
    <div class="relative w-full">
      <input
        maxlength="10"
        class="w-full border-1 border-solid border-gray-300 h-[38px] px-2 rounded-lg focus:border-black"
        type="text"
        :name="name"
        v-model="dynamicModel"
        :placeholder="placeholder"
      />
      <slot name="input-right" />
    </div>
    <slot name="input-tips" />
  </div>
</template>
