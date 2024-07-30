import { apiClient } from "./client";

export const getPopupListApi = async () => {
    return apiClient.get(`/api/v1/popups`);
  };