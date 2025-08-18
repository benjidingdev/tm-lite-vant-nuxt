import * as userApi from "~/api/userInfo";

export const coreStore = defineStore("coreStore", () => {
  let traderType = $ref({});
  let volume = $ref(1);
  let tokenShow = $ref(false);

  // Actions
  const isToken = (flag: boolean) => {
    tokenShow = flag;
  };

  const updateTraderType = (type: any) => {
    traderType = type;
  };

  const updateVolume = (volume_: any) => {
    console.log("updateVolume", volume_);
    volume = volume_;
  };
 

  return $$({
    updateTraderType,
    traderType,
    volume,
    updateVolume,
    isToken,
    tokenShow,
  });
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(coreStore, import.meta.hot));
}
