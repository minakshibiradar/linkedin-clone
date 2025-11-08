import api from './api';

export const fileService = {
  // Upload image file
  uploadImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to upload image' };
    }
  },

  // Get image URL
  getImageUrl: (fileName) => {
    if (!fileName) return null;
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
    return `${API_URL}/files/images/${fileName}`;
  },

  // Delete image
  deleteImage: async (fileName) => {
    try {
      await api.delete(`/files/images/${fileName}`);
    } catch (error) {
      throw error.response?.data || { error: 'Failed to delete image' };
    }
  },
};