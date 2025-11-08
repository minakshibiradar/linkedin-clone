import api from './api';

export const userService = {
  // Get user profile
  getUserProfile: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/profile`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch user profile' };
    }
  },

  // Get user by ID
  getUserById: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch user' };
    }
  },

  // Update profile image
  updateProfileImage: async (imageUrl) => {
    try {
      const response = await api.put('/users/profile/image', { imageUrl });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update profile image' };
    }
  },

  // Update profile
  updateProfile: async (name) => {
    try {
      const response = await api.put('/users/profile', { name });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update profile' };
    }
  },
};