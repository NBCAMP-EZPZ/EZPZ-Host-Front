import axiosInstance from './axiosInstance';

export const getMonthlySalesStatistics = async (itemId) => {
    const response = await axiosInstance.get(`/api/v1//sales-statistics/monthly`, {
      params: { itemId }
    });
    return response.data.data;
  };