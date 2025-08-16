export const tradeStore = defineStore("tradeStore", () => {
  let tradeVolume = $ref(1)
  const updateVolume = (volume: number) => {
    tradeVolume = volume
  }

  return $$({
    tradeVolume,
    updateVolume,
  });
}, {
  persist: true,
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(tradeStore, import.meta.hot));
}
