export const pmDataStore = defineStore("pmDataStore", () => {
  let pAmount = $ref(0);
  let pdcCards = $ref([]);
  let yesMarkets = $ref([]);
  let noMarkets = $ref([]);
  let refreshTime = $ref(new Date());
  let topic = $ref({})

  return $$({
    pAmount,
    pdcCards,
    yesMarkets,
    noMarkets,
    refreshTime,
    topic,
  });
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(pmDataStore, import.meta.hot));
}
