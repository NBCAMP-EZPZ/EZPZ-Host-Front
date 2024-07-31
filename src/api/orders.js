import axiosInstance from './axiosInstance';

export const getOrders = async (page, searchType = 'all', itemId = -1, orderStatus = 'all') => {
  try {
    const response = await axiosInstance.get('/api/v1/orders', {
      params: { page, searchType, itemId, orderStatus }
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getOrderDetail = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/v1/orders/${id}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};