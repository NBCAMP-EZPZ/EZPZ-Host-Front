import axiosInstance from './axiosInstance';

export const getSlots = async (popupId, page = 0) => {
  try {
    const response = await axiosInstance.get(`/api/v1/popups/${popupId}/slots`, {
      params: { page }
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getSlot = async (popupId, slotId) => {
    try {
      const response = await axiosInstance.get(`/api/v1/popups/${popupId}/slots/${slotId}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  };