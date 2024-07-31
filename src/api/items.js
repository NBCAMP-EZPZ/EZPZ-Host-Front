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

export const getItemDetail = async (itemId) => {
    try {
      const response = await axiosInstance.get(`/api/v1/items/${itemId}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  };

  export const updateItem = async (itemId, data) => {
    try {
      const response = await axiosInstance.put(`/api/v1/items/${itemId}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
  export const changeItemStatus = async (itemId, itemStatus) => {
    try {
      const response = await axiosInstance.patch(`/api/v1/items/${itemId}`, null, {
        params: { itemStatus }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };