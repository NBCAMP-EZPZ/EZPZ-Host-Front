import axiosInstance from './axiosInstance';

export const getPopups = async (approvalStatus = 'all', popupStatus = 'all', page = 0) => {
  try {
    const params = {
      approvalStatus,
      popupStatus,
      page
    };
    const response = await axiosInstance.get('/api/v1/popups', { params });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getPopupDetail = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/v1/popups/${id}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getReviews = async (id , page = 0) => {
  try {
    const response = await axiosInstance.get(`/api/v1/popups/${id}/reviews`, { params: { page } });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const updatePopup = async (id, data) => {
  try {
    const formData = new FormData();
    for (const key in data) {
      if (Array.isArray(data[key])) {
        data[key].forEach((item, index) => {
          formData.append(`${key}[${index}]`, item);
        });
      } else {
        formData.append(key, data[key]);
      }
    }
    const response = await axiosInstance.put(`/api/v1/popups/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const deletePopup = async (id) => {
  try {
    const response = await axiosInstance.patch(`/api/v1/popups/${id}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};
