export const pmDataStore = defineStore("pmDataStore", () => {
  let pAmount = $ref(0);
  let pdcCards = $ref([]);
  let pdcCardsOrigin = $ref([]);
  let yesMarkets = $ref([]);
  let noMarkets = $ref([]);
  let refreshTime = $ref(new Date());

  return $$({
    pAmount,
    pdcCards,
    yesMarkets,
    noMarkets,
    pdcCardsOrigin,
    refreshTime,
  });
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(pmDataStore, import.meta.hot));
}
