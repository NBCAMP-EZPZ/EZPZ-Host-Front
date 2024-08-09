import axiosInstance from './axiosInstance';

export const getMonthlySalesStatistics = async (itemId) => {
    const response = await axiosInstance.get(`/api/v1/sales-statistics/monthly`, {
      params: { itemId }
    });
    return response.data.data;
  };

export const getDailySalesStatistics = async (popupId) => {
    const response = await axiosInstance.get(`/api/v1/sales-statistics/recent-month`, {
      params: { popupId }
    });
    return response.data.data;
  };