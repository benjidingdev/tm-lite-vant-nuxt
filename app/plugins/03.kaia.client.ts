import {
  initializeKaiaSDK,
  isKaiaEnabled,
  getKaiaSDK,
} from "~/config/kaia";

export default defineNuxtPlugin(() => {

  if (!isKaiaEnabled.value) {
    console.log("Kaia SDK: Disabled by configuration");

    return;
  }

  initializeKaiaSDK()
    .then((sdk) => {
      if (!sdk) {
        console.error("Kaia SDK: Failed to initialize");
        return;
      }

      if (!sdk.isSupportedBrowser()) {
        console.warn("Kaia SDK: Browser not supported");
        return;
      }

      console.log("Kaia SDK: Plugin loaded successfully");
    })
    .catch((error) => {
      console.error("Kaia SDK Plugin Error:", error);
    });


  return {
    provide: {
      kaiaSDK: () => getKaiaSDK(),
      kaiaWalletProvider: () => getKaiaSDK()?.getWalletProvider(),
      kaiaPaymentProvider: () => getKaiaSDK()?.getPaymentProvider(),
    },
  };
});
