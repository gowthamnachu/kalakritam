import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="art-border top"></div>
      <div className="art-border bottom"></div>
      <div className="art-border left"></div>
      <div className="art-border right"></div>
      
      <div className="corner-art top-left"></div>
      <div className="corner-art top-right"></div>
      <div className="corner-art bottom-left"></div>
      <div className="corner-art bottom-right"></div>
      
      <div className="welcome-section">
        <div className="decorative-line"></div>
        <h1>Welcome to Kalakritam</h1>
        <p className="subtitle">Where creativity meets innovation</p>
        <div className="welcome-content">
          <p>We're delighted to have you here. Explore our world of artistic excellence and creative solutions.</p>
          <p>Discover unique designs, innovative concepts, and inspiring creations that make Kalakritam special.</p>
        </div>
        <div className="decorative-line"></div>
      </div>
    </div>
  );
};

export default Home;