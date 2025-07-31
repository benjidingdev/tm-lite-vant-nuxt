import axios from "axios";
import { authStore } from "@/stores/authStore";

export const BaseUrl = "http://192.168.1.82:18082";
//console.log('__VUE_branch', __VUE_branch)
//console.log('__VUE_commitHash', __VUE_commitHash)

// const { $pinia } = useNuxtApp(); // 获取 Pinia 实例
// const useUserStore = authStore($pinia); // 传入 Pinia 实例
// console.log("token", useUserStore);
// const { updateToken, token } = authStore();
const service = axios.create({
  baseURL: BaseUrl,
  timeout: 100000,
  // allow carry cookie
  withCredentials: false,
  // modify the request data before sending it to the server
  transformRequest: [
    (data, headers) => {
      headers["Content-Type"] = "application/json";
      const { token } = $(authStore());
      if (token.accessToken) {
        headers["Authorization"] = token.accessToken;
      }
      headers.Language = "";
      return JSON.stringify(data);
    },
  ],
});

service.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (res.code === 401) {
      //   ElMessage.error(res.msg);
      const { updateToken, isToken } = $(authStore());
      //api report 401 means login expired, need to clear personal information and expired token
      updateToken({});
      //   updateUserInfo({});
      // show popup login modal after clear user info
      isToken(true);
    } else if (res.code !== 0) {
      // alert(res.msg);
      return Promise.reject(new Error(res.msg || "Error"));
    } else {
      return res;
    }
  },
  (error) => {
    // if (error.response && error.response.status !== 200) {
    //     alert(error);
    // }
    return Promise.reject(error);
  }
);

export default service;
