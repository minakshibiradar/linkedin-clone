import React, { useState, useEffect } from 'react';
import { postService } from '../services/postService';
import PostCard from './PostCard';
import Loader from './Loader';
import './PostList.css';

const PostList = ({ refreshTrigger }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts();
  }, [refreshTrigger]);

  const fetchPosts = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await postService.getAllPosts();
      setPosts(data);
    } catch (err) {
      setError(err.error || 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const handlePostUpdated = (updatedPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === updatedPost.id ? updatedPost : post
      )
    );
  };

  const handlePostDeleted = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button className="btn btn-primary" onClick={fetchPosts}>
          Try Again
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="empty-state card">
        <div className="empty-state-icon">📝</div>
        <h3>No posts yet</h3>
        <p>Be the first to share something!</p>
      </div>
    );
  }

  return (
    <div className="post-list">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onPostUpdated={handlePostUpdated}
          onPostDeleted={handlePostDeleted}
        />
      ))}
    </div>
  );
};

export default PostList;