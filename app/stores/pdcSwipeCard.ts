export const pdcSwipeCardStore = defineStore("pdcSwipeCardStore", () => {
  let userAsset = $ref({
    userId: "",
    pAmount: 0,
  });

  return $$({
    userAsset,
  });
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(pdcSwipeCardStore, import.meta.hot));
}
