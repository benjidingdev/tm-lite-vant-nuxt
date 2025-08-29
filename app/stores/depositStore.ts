export const depositStore = defineStore("depositStore", () => {
  let depositData = $ref({
    depositFromAddress: "",
    depositToAddress: "",
  });

  return $$({
    depositData,
  });
}, {
  persist: true,
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(depositStore, import.meta.hot));
}
