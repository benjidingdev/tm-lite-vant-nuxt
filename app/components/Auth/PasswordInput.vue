<script lang="ts" setup>
let model = $(defineModel());
let isFocused = $ref(false);

let inputArr = $computed(() => {
  return model?.split("");
});

const onFocus = () => {
  isFocused = true;
};

const onInput = (event) => {
  const value = event.target.value;
  model = value;
};
</script>

<template>
  <div class="code-container w-full">
    <span
      v-for="(n, index) in 6"
      :key="n"
      :class="`code-box rounded ${
        isFocused && inputArr.length === index && 'border-black!'
      }`"
    >
      {{ inputArr[index] }}
      <span v-if="isFocused && inputArr.length === index" class="cursor" />
    </span>
    <input
      id="password-input"
      type="tel"
      autofocus
      class="hidden-input"
      maxlength="6"
      @input="onInput"
      @focus="isFocused = true"
      @blur="isFocused = false"
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
</style>
