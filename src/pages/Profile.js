import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { postService } from '../services/postService';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';
import Loader from '../components/Loader';
import './Profile.css';

const Profile = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isOwnProfile = currentUser?.id === parseInt(userId);

  useEffect(() => {
    fetchUserProfile();
    fetchUserPosts();
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      const data = await userService.getUserProfile(userId);
      setProfile(data);
    } catch (err) {
      setError(err.error || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const data = await postService.getUserPosts(userId);
      setPosts(data);
    } catch (err) {
      console.error('Failed to load posts:', err);
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
    setProfile({ ...profile, postCount: profile.postCount - 1 });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Loader />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Go to Home
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-container">
        <div className="profile-header card">
          <div className="profile-cover"></div>
          <div className="profile-info">
            <div className="profile-avatar-large">
              {profile.name?.charAt(0).toUpperCase()}
            </div>
            <div className="profile-details">
              <h1 className="profile-name">{profile.name}</h1>
              <p className="profile-email">{profile.email}</p>
              <div className="profile-stats">
                <div className="profile-stat">
                  <span className="stat-value">{profile.postCount}</span>
                  <span className="stat-label">Posts</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-posts-header">
            <h2>{isOwnProfile ? 'Your Posts' : `${profile.name}'s Posts`}</h2>
          </div>

          {posts.length === 0 ? (
            <div className="empty-state card">
              <div className="empty-state-icon">📝</div>
              <h3>No posts yet</h3>
              <p>
                {isOwnProfile
                  ? 'Share your first post!'
                  : 'This user hasn\'t posted anything yet.'}
              </p>
              {isOwnProfile && (
                <button
                  className="btn btn-primary"
                  onClick={() => navigate('/')}
                >
                  Create Post
                </button>
              )}
            </div>
          ) : (
            <div className="profile-posts-list">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onPostUpdated={handlePostUpdated}
                  onPostDeleted={handlePostDeleted}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;