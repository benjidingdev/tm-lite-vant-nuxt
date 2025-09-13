<script lang="ts" setup>
import { _debounce } from "@/utils/debounce";

let { pwdInputRef, isPwdFocused } = $(uiStore());
let { oneTimePassword, doLogin, errorInfo } = $(privyStore());

let inputArr = $computed(() => {
  return oneTimePassword?.split("");
});

const onFocus = () => {
  isPwdFocused = true;
};

const onBlur = () => {
  isPwdFocused = false;
};

const onInput = async (event: any) => {
  if (!isPwdFocused) {
    return;
  }
  oneTimePassword = event.target.value;
};

watch(
  () => oneTimePassword,
  async (newVal: string) => {
    if (newVal.length === 6) {
      // The entrance of login
      await doLogin();
      isPwdFocused = true;
      pwdInputRef?.value?.focus();
      oneTimePassword = "";
    } else {
      errorInfo = "";
    }
  }
);

</script>

<template>
  <div class="w-full relative flex justify-between mt-3">
    <span v-for="(n, index) in 6" :key="n"
      class="w-[40px] h-[50px] border-1 border-solid border-gray-400 rounded-xl flex justify-center items-center rounded"
      :class="`${isPwdFocused && inputArr.length === index && 'border-black!'}`">
      {{ inputArr[index] }}
      <span v-if="isPwdFocused && inputArr.length === index" class="cursor" />
    </span>
    <input id="password-input" ref="pwdInputRef" type="number" v-model="oneTimePassword"
      :class="[isPwdFocused ? 'focus' : 'not-focus', 'hidden-input']" maxlength="6"
      @input="(e) => _debounce(onInput(e), 100)" @focus.prevent="onFocus" @blur.prevent="onBlur" />
  </div>
</template>
<style>
.hidden-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  color: transparent;
  caret-color: transparent;
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

.step-one .van-field__control,
.step-one .van-field__error-message {
  margin-left: 10px !important;
}
</style>
