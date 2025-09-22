export const checkinStore = defineStore("checkinStore", () => {
  let userId: string = $ref('');
  let jackpot: any = $ref({});
  let refreshJackpot = $ref(false);

  return $$({
    userId,
    jackpot,
    refreshJackpot,
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
