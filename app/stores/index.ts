export const coreStore = defineStore("coreStore", () => {


  return $$({
  });
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(coreStore, import.meta.hot));
}
