import * as userApi from "~/api/userInfo";
import { getOrderAmount } from "~/api/markets";

export const userStore = defineStore("userStore", () => {
  const { token } = $(authStore());

  let userInfo = $ref({});
  let userOrderAmountInfo = $ref({ feeAmount: 0, totalAmount: 0 })
  const userOrderAmount = $computed(() => userOrderAmountInfo.feeAmount + userOrderAmountInfo.totalAmount);

  const { userBalance } = $(walletStore())
  const userCanUseAmount = $computed(() => userBalance - userOrderAmount);

  let hasSetLocale = $ref(false);

  let order = $ref({
    positionList: [] as any[],
    openOrderList: [] as any[],
    historyList: [] as any[],
  });

  //refresh user info after login
  const loadUserInfo = async () => {
    if (!token.accessToken) {
      return
    }

    try {
      let user = await userApi.getUserInfo();
      if (user.data) {
        userInfo = user.data;
      }
    } catch (error) {
      console.error('get user info error:', error);
    }

  };

  async function updateUserOrderAmountInfo() {
    try {
      const rz = await getOrderAmount();
      if (rz.data) {
        userOrderAmountInfo = rz.data;
        // console.log(rz.data, userOrderAmountInfo, userOrderAmount);
      }
    } catch (error) {
      console.error('get user order amount error:', error);
    }
  }

  return $$({
    userInfo,
    order,
    hasSetLocale,
    loadUserInfo,
    updateUserOrderAmountInfo,
    userOrderAmountInfo,
    userOrderAmount,
    userCanUseAmount,
  });
},
  {
    persist: {
      debug: true,
      omit: ['order'],
    },
  }
);

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(userStore, import.meta.hot));
}
