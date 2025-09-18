export const pdcSwipeCardStore = defineStore("pdcSwipeCardStore", () => {
  let userAsset = $ref(0);
  let pdcCards = $ref([]);

  return $$({
    userAsset,
    pdcCards,
  });
},
  {
    persist: {
      debug: true,
    },
  });

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(pdcSwipeCardStore, import.meta.hot));
}
