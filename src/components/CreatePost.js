import React, { useState, useRef } from 'react';
import { postService } from '../services/postService';
import { fileService } from '../services/fileService';
import './CreatePost.css';

const CreatePost = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('Image size must be less than 10MB');
        return;
      }

      setImageFile(file);
      setError('');

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Post content cannot be empty');
      return;
    }

    setLoading(true);
    setError('');
    let uploadedImageUrl = null;

    try {
      // Upload image if selected
      if (imageFile) {
        setUploadProgress(true);
        const uploadResponse = await fileService.uploadImage(imageFile);
        uploadedImageUrl = uploadResponse.fileUrl;
        setUploadProgress(false);
      }

      // Create post
      const newPost = await postService.createPost(
        content.trim(),
        uploadedImageUrl
      );

      // Reset form
      setContent('');
      setImageFile(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      onPostCreated(newPost);
    } catch (err) {
      setError(err.error || 'Failed to create post');
    } finally {
      setLoading(false);
      setUploadProgress(false);
    }
  };

  return (
    <div className="create-post card">
      <h2 className="create-post-title">Create a Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <textarea
            placeholder="What do you want to talk about?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={5000}
            rows={4}
            disabled={loading}
          />
          <span className="char-count">{content.length}/5000</span>
        </div>

        {imagePreview && (
          <div className="image-preview-container">
            <img src={imagePreview} alt="Preview" className="image-preview" />
            <button
              type="button"
              className="remove-image-btn"
              onClick={handleRemoveImage}
              disabled={loading}
            >
              ✕
            </button>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        {uploadProgress && (
          <div className="upload-progress">
            <div className="loader"></div>
            <span>Uploading image...</span>
          </div>
        )}

        <div className="create-post-footer">
          <div className="post-actions-left">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              style={{ display: 'none' }}
              disabled={loading}
            />
            <button
              type="button"
              className="btn-icon-text"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
            >
              <span>🖼️</span>
              <span>Photo</span>
            </button>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !content.trim()}
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;