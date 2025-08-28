export const depositStore = defineStore("depositStore", () => {
  let depositData = $ref({
    depositToAddress: "",
  });

  return $$({
    depositData,
  });
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(depositStore, import.meta.hot));
}
