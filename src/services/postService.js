import api from './api';

export const postService = {
  // Create a new post
  createPost: async (content, imageUrl = null) => {
    try {
      const response = await api.post('/posts', {
        content,
        imageUrl,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to create post' };
    }
  },

  // Get all posts
  getAllPosts: async () => {
    try {
      const response = await api.get('/posts');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch posts' };
    }
  },

  // Get post by ID
  getPostById: async (id) => {
    try {
      const response = await api.get(`/posts/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch post' };
    }
  },

  // Update post
  updatePost: async (id, content, imageUrl = null) => {
    try {
      const response = await api.put(`/posts/${id}`, {
        content,
        imageUrl,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update post' };
    }
  },

  // Delete post
  deletePost: async (id) => {
    try {
      await api.delete(`/posts/${id}`);
    } catch (error) {
      throw error.response?.data || { error: 'Failed to delete post' };
    }
  },

  // Get posts by user
  getUserPosts: async (userId) => {
    try {
      const response = await api.get(`/posts/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch user posts' };
    }
  },

  // Toggle like on a post
  toggleLike: async (postId) => {
    try {
      const response = await api.post(`/posts/${postId}/likes`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to toggle like' };
    }
  },

  // Get comments for a post
  getComments: async (postId) => {
    try {
      const response = await api.get(`/posts/${postId}/comments`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch comments' };
    }
  },

  // Create a comment
  createComment: async (postId, content) => {
    try {
      const response = await api.post(`/posts/${postId}/comments`, {
        content,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to create comment' };
    }
  },

  // Update comment
  updateComment: async (postId, commentId, content) => {
    try {
      const response = await api.put(`/posts/${postId}/comments/${commentId}`, {
        content,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update comment' };
    }
  },

  // Delete comment
  deleteComment: async (postId, commentId) => {
    try {
      await api.delete(`/posts/${postId}/comments/${commentId}`);
    } catch (error) {
      throw error.response?.data || { error: 'Failed to delete comment' };
    }
  },

  // Share a post
  sharePost: async (postId, additionalContent = '') => {
    try {
      const response = await api.post(`/posts/${postId}/share`, {
        content: additionalContent,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to share post' };
    }
  },
};