import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { postService } from '../services/postService';
import { fileService } from '../services/fileService';
import { formatDate } from '../utils/formatDate';
import CommentSection from './CommentSection';
import ShareModal from './ShareModal';
import './PostCard.css';

const PostCard = ({ post, onPostUpdated, onPostDeleted }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [editImageUrl, setEditImageUrl] = useState(post.imageUrl || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Interaction states
  const [liked, setLiked] = useState(post.likedByCurrentUser);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [showComments, setShowComments] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareCount, setShareCount] = useState(post.shareCount);

  const isOwner = user?.id === post.userId;

  const handleEdit = () => {
    setIsEditing(true);
    setEditContent(post.content);
    setEditImageUrl(post.imageUrl || '');
    setError('');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(post.content);
    setEditImageUrl(post.imageUrl || '');
    setError('');
  };

  const handleUpdate = async () => {
    if (!editContent.trim()) {
      setError('Post content cannot be empty');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const updatedPost = await postService.updatePost(
        post.id,
        editContent.trim(),
        editImageUrl.trim() || null
      );
      onPostUpdated(updatedPost);
      setIsEditing(false);
    } catch (err) {
      setError(err.error || 'Failed to update post');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      setLoading(true);
      try {
        await postService.deletePost(post.id);
        onPostDeleted(post.id);
      } catch (err) {
        alert(err.error || 'Failed to delete post');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleLike = async () => {
    try {
      const response = await postService.toggleLike(post.id);
      setLiked(response.liked);
      setLikeCount(response.likeCount);
    } catch (err) {
      console.error('Failed to toggle like:', err);
    }
  };

  const handleShare = (sharedPost) => {
    setShareCount(shareCount + 1);
    // You can also refresh the post list here if needed
  };

  return (
    <div className="post-card card">
      <div className="post-header">
        <div className="post-author">
          <div className="post-avatar">
            {post.userName?.charAt(0).toUpperCase()}
          </div>
          <div className="post-author-info">
            <h3 className="post-author-name">{post.userName}</h3>
            <span className="post-time">{formatDate(post.createdAt)}</span>
          </div>
        </div>

        {isOwner && !isEditing && (
          <div className="post-actions">
            <button
              className="btn-icon"
              onClick={handleEdit}
              disabled={loading}
              title="Edit post"
            >
              ✏️
            </button>
            <button
              className="btn-icon"
              onClick={handleDelete}
              disabled={loading}
              title="Delete post"
            >
              🗑️
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="post-edit-form">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            maxLength={5000}
            rows={4}
            disabled={loading}
          />
          <input
            type="url"
            placeholder="Image URL (optional)"
            value={editImageUrl}
            onChange={(e) => setEditImageUrl(e.target.value)}
            disabled={loading}
          />
          {error && <div className="error-message">{error}</div>}
          <div className="post-edit-actions">
            <button
              className="btn btn-secondary"
              onClick={handleCancelEdit}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleUpdate}
              disabled={loading || !editContent.trim()}
            >
              {loading ? 'Updating...' : 'Update'}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="post-content">
            <p>{post.content}</p>
          </div>

          {post.imageUrl && (
            <div className="post-image">
              <img 
                src={post.imageUrl.startsWith('/api') 
                  ? `${process.env.REACT_APP_API_URL || 'http://localhost:8080/api'}${post.imageUrl.replace('/api', '')}` 
                  : post.imageUrl
                } 
                alt="Post content" 
              />
            </div>
          )}

          {/* Show shared post if exists */}
          {post.sharedPost && (
            <div className="shared-post-container">
              <div className="shared-post-header">
                <div className="shared-post-avatar">
                  {post.sharedPost.userName?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="shared-post-author">
                    {post.sharedPost.userName}
                  </div>
                  <div className="shared-post-time">
                    {formatDate(post.sharedPost.createdAt)}
                  </div>
                </div>
              </div>
              <div className="shared-post-content">
                <p>{post.sharedPost.content}</p>
                {post.sharedPost.imageUrl && (
                  <img
                    src={post.sharedPost.imageUrl}
                    alt="Shared content"
                    className="shared-post-image"
                  />
                )}
              </div>
            </div>
          )}

          <div className="post-stats">
            <span className="post-stat">
              {likeCount} {likeCount === 1 ? 'like' : 'likes'}
            </span>
            <span className="post-stat">
              {post.commentCount}{' '}
              {post.commentCount === 1 ? 'comment' : 'comments'}
            </span>
            <span className="post-stat">
              {shareCount} {shareCount === 1 ? 'share' : 'shares'}
            </span>
          </div>

          <div className="post-footer">
            <button
              className={`post-footer-btn ${liked ? 'liked' : ''}`}
              onClick={handleLike}
            >
              <span>{liked ? '❤️' : '🤍'}</span>
              <span>Like</span>
            </button>
            <button
              className="post-footer-btn"
              onClick={() => setShowComments(true)}
            >
              <span>💬</span>
              <span>Comment</span>
            </button>
            <button
              className="post-footer-btn"
              onClick={() => setShowShareModal(true)}
            >
              <span>↗️</span>
              <span>Share</span>
            </button>
          </div>
        </>
      )}

      {/* Comment Section Modal */}
      <CommentSection
        postId={post.id}
        isOpen={showComments}
        onClose={() => setShowComments(false)}
      />

      {/* Share Modal */}
      <ShareModal
        post={post}
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        onShare={handleShare}
      />
    </div>
  );
};

export default PostCard;