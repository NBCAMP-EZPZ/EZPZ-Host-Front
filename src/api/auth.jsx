import { apiClient } from "./client";

export const logInApi = async () => {
    return apiClient.get(`/api/v1/login`);
  };