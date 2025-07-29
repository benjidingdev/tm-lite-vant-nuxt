import { defineStore } from "pinia";
import * as walletApi from "~/api/wallet";

export const useWalletStore = defineStore("walletStore", () => {
  let walletAddress = $ref("");
  let walletBalance = $ref(0);
  let nonce = $ref("");

  const setWalletAddress = (address: string) => {
    walletAddress = address;
  };

  const setWalletBalance = (balance: number) => {
    walletBalance = balance;
  };

  /**
   * 拉取签名message getNonce
   */
  const getNonce = async (_address: any) => {
    try {
      let res: any = await walletApi.getNonce({ proxyWallet: _address });
      nonce = res.msg || "error";
      return res;
    } catch (error) {
      //console.log("获取签名失败", error);
      throw error;
    }
  };

  return $$({
    walletAddress,
    walletBalance,
    setWalletAddress,
    setWalletBalance,
    getNonce,
    nonce,
  });
});
