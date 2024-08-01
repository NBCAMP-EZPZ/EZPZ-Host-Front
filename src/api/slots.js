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

  export const createSlot = async (popupId, data) => {
    try{
      const response = await axiosInstance.post(`/api/v1/popups/${popupId}/slots`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

// 슬롯 업데이트
export const updateSlot = async (popupId, slotId, slotUpdateDto) => {
  try {
    const response = await axiosInstance.patch(`/api/v1/popups/${popupId}/slots/${slotId}`, slotUpdateDto);
    return response.data.data; // 실제 데이터 구조에 따라 조정할 수 있습니다.
  } catch (error) {
    throw error;
  }
};

export const deleteSlot = async (popupId, slotId) => {
  try {
    const response = await axiosInstance.delete(`/api/v1/popups/${popupId}/slots/${slotId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 슬롯 예약 정보 조회 API 호출 함수
export const getSlotReservations = async (popupId, slotId) => {
  try {
    const response = await axiosInstance.get(`/api/v1/popups/${popupId}/slots/${slotId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};