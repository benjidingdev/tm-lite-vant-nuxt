import * as userApi from "~/api/userInfo";
import {
  getTopicsRecommend,
  getTopicsOrderPreview,
  getTopicsOrderCreate,
  getOrderAmount,
} from "~/api/market";
import { parseUnits } from "viem";


export const requestQueueStore = defineStore("requestQueueStore", () => {

  const { tradeVolume } = $(tradeStore());
  const {signTradeData, queryAllowanceAndPermit} = $(walletStore());

  const queueMap = $ref({});

  const addRequest = (key: number, request: any) => {
    queueMap[key] = request;
    processRequest(key);
  };

  const getRequest = (key: number) => {
    return queueMap[key];
  };

  const removeRequest = (key: number) => {
    delete queueMap[key];
  };

  const processRequest = async (key: number) => {

    const transaction = getRequest(key);

    // setLoadingToast("Processing transaction");
      const amountRes = await getOrderAmount();
      if (amountRes.code === 0) {
        const allowanceAmount =
          (transaction.textPrice + transaction.fee) * tradeVolume +
          amountRes.data.totalAmount;
        let allowanceRes = await queryAllowanceAndPermit(0, allowanceAmount);
        if (!allowanceRes) {
          showFailToast("Permit Authorization Failed");
          return false;
        }
      } else {
        showFailToast("Permit Authorization Failed");
        return false;
      }

    const req = {
      marketId: transaction.marketsId || 1012110,
      type: transaction.type, //1-YES；2-NO,
      amount: null,
      volume: tradeVolume,
      priceType: 1, //1-market price ；2-limited price; 3-merged price; 4-split price
      orderType: 1, //1: buy, 2: sell
      price: transaction.textPrice * 100,
      isDeduction: false,
    };
    let result = await getTopicsOrderPreview(req);
    if (result.code === 0) {
      const order = { ...result.data };
      let tradeSign;
      try {
        result.data.slippageBps = parseUnits(result.data.slippageBps + "", 4);
        result.data.tokenAmount = parseUnits(result.data.tokenAmount + "", 6);
        result.data.tokenPriceInPaymentToken = parseUnits(
          result.data.tokenPriceInPaymentToken + "",
          6
        );
        tradeSign = await signTradeData({ order: result.data });
      } catch (e) { }
      if (tradeSign) {
        const params = {
          salt: order.salt,
          message: JSON.stringify(order),
          signContent: tradeSign,
        };
        let res = await getTopicsOrderCreate(params);
        console.log("create order res:", res);
        if (res.code === 0) {
          // showSuccessToast("Transaction Successful");
        } else {
          showFailToast(
            "Transaction Failed" + `: ${res.message || "Unknown error"}`
          );
        }
      }
    }
  };

  return $$({
    addRequest,
    getRequest,
    removeRequest,
  });
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(requestQueueStore, import.meta.hot));
}
