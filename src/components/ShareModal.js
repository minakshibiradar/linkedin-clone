import React, { useState } from 'react';
import { postService } from '../services/postService';
import './ShareModal.css';

const ShareModal = ({ post, isOpen, onClose, onShare }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleShare = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const sharedPost = await postService.sharePost(post.id, content.trim());
      onShare(sharedPost);
      setContent('');
      onClose();
    } catch (err) {
      setError(err.error || 'Failed to share post');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="share-modal-overlay" onClick={onClose}>
      <div className="share-modal" onClick={(e) => e.stopPropagation()}>
        <div className="share-modal-header">
          <h3>Share Post</h3>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleShare}>
          <div className="share-modal-body">
            <textarea
              placeholder="Say something about this..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={5000}
              rows={4}
              disabled={loading}
            />

            <div className="shared-post-preview">
              <div className="shared-post-header">
                <div className="shared-post-avatar">
                  {post.userName?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="shared-post-author">{post.userName}</div>
                </div>
              </div>
              <div className="shared-post-content">
                <p>{post.content}</p>
                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt="Shared post"
                    className="shared-post-image"
                  />
                )}
              </div>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="share-modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Sharing...' : 'Share'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShareModal;