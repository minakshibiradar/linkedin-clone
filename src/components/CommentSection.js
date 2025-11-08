import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { postService } from '../services/postService';
import { formatDate } from '../utils/formatDate';
import './CommentSection.css';

const CommentSection = ({ postId, isOpen, onClose }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchComments();
    }
  }, [isOpen, postId]);

  const fetchComments = async () => {
    try {
      const data = await postService.getComments(postId);
      setComments(data);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    setError('');

    try {
      const comment = await postService.createComment(postId, newComment.trim());
      setComments([comment, ...comments]);
      setNewComment('');
    } catch (err) {
      setError(err.error || 'Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  const handleEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
  };

  const handleUpdateComment = async (commentId) => {
    if (!editContent.trim()) return;

    setLoading(true);
    try {
      const updatedComment = await postService.updateComment(
        postId,
        commentId,
        editContent.trim()
      );
      setComments(
        comments.map((c) => (c.id === commentId ? updatedComment : c))
      );
      setEditingCommentId(null);
      setEditContent('');
    } catch (err) {
      alert(err.error || 'Failed to update comment');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;

    try {
      await postService.deleteComment(postId, commentId);
      setComments(comments.filter((c) => c.id !== commentId));
    } catch (err) {
      alert(err.error || 'Failed to delete comment');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="comment-section-overlay" onClick={onClose}>
      <div className="comment-section" onClick={(e) => e.stopPropagation()}>
        <div className="comment-section-header">
          <h3>Comments ({comments.length})</h3>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="comment-input-container">
          <form onSubmit={handleAddComment}>
            <div className="comment-input-wrapper">
              <div className="comment-avatar">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <input
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                disabled={loading}
                maxLength={2000}
              />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || !newComment.trim()}
              >
                Post
              </button>
            </div>
          </form>
          {error && <div className="error-message">{error}</div>}
        </div>

        <div className="comments-list">
          {comments.length === 0 ? (
            <div className="no-comments">
              <p>No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <div className="comment-avatar">
                  {comment.userName?.charAt(0).toUpperCase()}
                </div>
                <div className="comment-content-wrapper">
                  <div className="comment-header">
                    <span className="comment-author">{comment.userName}</span>
                    <span className="comment-time">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>

                  {editingCommentId === comment.id ? (
                    <div className="comment-edit-form">
                      <input
                        type="text"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        disabled={loading}
                      />
                      <div className="comment-edit-actions">
                        <button
                          className="btn-sm btn-secondary"
                          onClick={() => {
                            setEditingCommentId(null);
                            setEditContent('');
                          }}
                          disabled={loading}
                        >
                          Cancel
                        </button>
                        <button
                          className="btn-sm btn-primary"
                          onClick={() => handleUpdateComment(comment.id)}
                          disabled={loading || !editContent.trim()}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="comment-text">{comment.content}</p>
                      {comment.userId === user?.id && (
                        <div className="comment-actions">
                          <button
                            className="comment-action-btn"
                            onClick={() => handleEditComment(comment)}
                          >
                            Edit
                          </button>
                          <button
                            className="comment-action-btn"
                            onClick={() => handleDeleteComment(comment.id)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentSection;