export const checkinStore = defineStore("checkinStore", () => {
  let jackpot: any = $ref({});

  return $$({
    jackpot,
  });
},
  {
    persist: {
      debug: true,
    },
  });

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(checkinStore, import.meta.hot));
}
