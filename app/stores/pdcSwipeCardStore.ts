export const pdcSwipeCardStore = defineStore("pdcSwipeCardStore", () => {
  let pAmount = $ref(0);
  let pdcCards = $ref([]);
  let pdcCardsOrigin = $ref([]);
  let yesMarkets = $ref([]);
  let noMarkets = $ref([]);

  return $$({
    pAmount,
    pdcCards,
    yesMarkets,
    noMarkets,
    pdcCardsOrigin,
  });
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(pdcSwipeCardStore, import.meta.hot));
}
