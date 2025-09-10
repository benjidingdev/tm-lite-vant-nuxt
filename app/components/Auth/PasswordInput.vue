<script lang="ts" setup>
import { _debounce } from "@/utils/debounce";
import { useTemplateRef } from "vue";

let { pwdInputRef, isPwdFocused } = $(uiStore());

let model = $(defineModel());

let value;
pwdInputRef = useTemplateRef("inputRef");
console.log(pwdInputRef, "inputRef");

let inputArr = $computed(() => {
  return model?.split("");
});

const onFocus = () => {
  isPwdFocused = true;
};

const onBlur = () => {
  isPwdFocused = false;
};

const onInput = async (event) => {
  if (!isPwdFocused) {
    return;
  }
  value = event.target.value;
  model = value;
};
</script>

<template>
  <div class="code-container w-full">
    <span
      v-for="(n, index) in 6"
      :key="n"
      :class="`code-box rounded ${
        isPwdFocused && inputArr.length === index && 'border-black!'
      }`"
    >
      {{ inputArr[index] }}
      <span v-if="isPwdFocused && inputArr.length === index" class="cursor" />
    </span>
    <input
      id="password-input"
      ref="inputRef"
      type="text"
      :class="[isPwdFocused ? 'focus' : 'not-focus', 'hidden-input']"
      maxlength="6"
      @input="(e) => _debounce(onInput(e), 100)"
      @focus.prevent="onFocus"
      @blur.prevent="onBlur"
    />
  </div>
</template>
<style>
.code-container {
  position: relative;
  display: flex;
  justify-content: space-between;
}

.code-box {
  width: 40px;
  height: 50px;
  border: 1px solid #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hidden-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.1;
  color: transparent;
}
.cursor {
  display: inline-block;
  width: 1px;
  height: 1.2em;
  background-color: black;
  margin-left: 2px;
  animation: blink 1.2s steps(1) infinite;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}
</style>
