import axiosInstance from './axiosInstance';

export const getItems = async (popupId = 'all', itemStatus = 'all', page = 0) => {
  try {
    const response = await axiosInstance.get('/api/v1/items', {
      params: { popupId, itemStatus, page }
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
