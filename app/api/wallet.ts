// import Request from '../utils/request'
import axios from "axios";

//取得钱包签名用的随机字符串
export const getNonce = (params = {}) => {
  return new Promise((resolve, reject) => {
    axios
      .post("/app-api/topic/user/wallet-nonce", { params })
      .then((response) => {
        if (response.data.code === 0) {
          resolve(response.data.data);
        } else {
          reject(response.data.msg);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

//钱包登录
export const loginByWallet = (params = {}) => {
  return new Promise((resolve, reject) => {
    axios
      .post("/app-api/topic/user/wallet-login", params)
      .then((response) => {
        if (response.data.code === 0) {
          resolve(response.data.data);
        } else {
          reject(response.data.msg);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });

  // return Request({
  //     url: '/app-api/topic/user/wallet-login',
  //     method: 'post',
  //     data: params
  // })
};
//购币地址
// export const getDepositUrl = (params = {}) => {
//     return Request({
//         url: '/app-api/topic/user/haha/get/url',
//         method: 'get',
//         params
//     })
// }
// //购币订单列表
// export const getDepositOrder = (params = {}) => {
//     return Request({
//         url: '/app-api/topic/user/haha/page/order',
//         method: 'post',
//         data: params
//     })
// }
// //购币订单详情
// export const getDepositOrderDetail = (params = {}) => {
//     return Request({
//         url: '/app-api/topic/user/haha/get/order',
//         method: 'get',
//         params
//     })
// }
// //线下代币余额
// export const getTokenAccount = (params = {}) => {
//     return Request({
//         url: '/app-api/topic/token/account/get',
//         method: 'get',
//         params
//     })
// }
// //线下代币明细
// export const getTokenPage = (params = {}) => {
//     return Request({
//         url: '/app-api/topic/token/account/page',
//         method: 'post',
//         data: params
//     })
// }
// //线下代币提取
// export const withdrawToken = (params = {}) => {
//     return Request({
//         url: '/app-api/topic/token/account/draw',
//         method: 'post',
//         data: params
//     })
// }
// //经纪人提现签名
// export const broketSign = (params = {}) => {
//     return Request({
//         url: '/app-api/topic/user/broker/preSign',
//         method: 'post',
//         data: params
//     })
// }
// //经纪人提现
// export const broketWithdraw = (params = {}) => {
//     return Request({
//         url: '/app-api/topic/user/broker/withdraw',
//         method: 'post',
//         data: params
//     })
// }
// //points account
// export const pointsAccount = () => {
//     return Request({
//         url: '/app-api/topic/point/account/get',
//         method: 'get',
//     })
// }
// //points detail
// export const pointsDetail = (params = {}) => {
//     return Request({
//         url: '/app-api/topic/point/account/page',
//         method: 'post',
//         data: params
//     })
// }
