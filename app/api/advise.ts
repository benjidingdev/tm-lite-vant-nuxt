import Request from "@/utils/request";

export const addAdviseList = (params = {}) => {
  return Request({
    url: `/app-api/topic/advise/create`,
    method: "post",
    data: params,
  });
};

export const getAdviseList = (params = {}) => {
  return Request({
    url: `/app-api/topic/advise/page`,
    method: "post",
    data: params,
  });
};


export const getTopicsVote = (adviseId: number) => {
    return Request({
        url: `/app-api/topic/advise/vote?adviseId=${adviseId}`,
        method: 'get',
    })
}
