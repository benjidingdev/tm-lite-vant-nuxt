import Request from "../utils/request";

//get nonce
const config = useRuntimeConfig();
const host = config.public.host;
export const getNonce = (params = {}) => {
  return Request({
    url: `${host}/app-api/topic/user/getNonce`,
    method: "post",
    data: params,
  });
};

//wallet login
export const loginByWallet = (params = {}) => {
  return Request({
    url: `${host}/app-api/topic/user/wallet-login`,
    method: "post",
    data: params,
  });
};
