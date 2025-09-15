export default defineNuxtPlugin(() => {
  if (typeof globalThis.crypto === "undefined") {

    globalThis.crypto = {};
  }

  //  Bedomalvalues ​​polyfill
  if (!globalThis.crypto.getRandomValues) {
    globalThis.crypto.getRandomValues = (arr: Uint8Array) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256);
      }
      return arr;
    };
  }

  // Provide randomBytes polyfill
  if (typeof globalThis.randomBytes === "undefined") {
    globalThis.randomBytes = (size: number) => {
      const arr = new Uint8Array(size);
      for (let i = 0; i < size; i++) {
        arr[i] = Math.floor(Math.random() * 256);
      }
      return arr;
    };
  }

  // Make sure the Buffer exists
  if (typeof globalThis.Buffer === "undefined") {
    try {
      globalThis.Buffer = require('buffer/').Buffer;
    } catch (e) {
      // If require fails, create a simple Buffer polyfill
      // @ts-ignore
      globalThis.Buffer = {
        from: (data: any) => {
          if (typeof data === 'string') {
            const arr = new Uint8Array(data.length);
            for (let i = 0; i < data.length; i++) {
              arr[i] = data.charCodeAt(i);
            }
            return arr;
          }
          return new Uint8Array(data);
        }
      };
    }
  }

  // Make sure the process exists
  if (typeof globalThis.process === "undefined") {
    globalThis.process = { env: {} };
  }

  if (typeof globalThis.global === "undefined") {

    globalThis.global = globalThis;
  }
});
