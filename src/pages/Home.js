import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import CreatePost from '../components/CreatePost';
import PostList from '../components/PostList';
import './Home.css';

const Home = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handlePostCreated = () => {
    // Trigger refresh of post list
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="home">
      <Navbar />
      <div className="home-container">
        <main className="home-main">
          <CreatePost onPostCreated={handlePostCreated} />
          <PostList refreshTrigger={refreshTrigger} />
        </main>
      </div>
    </div>
  );
};

export default Home;