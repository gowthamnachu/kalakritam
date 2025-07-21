import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-container">
      <div className="art-border top"></div>
      <div className="art-border bottom"></div>
      <div className="art-border left"></div>
      <div className="art-border right"></div>
      
      <div className="corner-art top-left"></div>
      <div className="corner-art top-right"></div>
      <div className="corner-art bottom-left"></div>
      <div className="corner-art bottom-right"></div>
      
      <div className="content-section">
        <div className="decorative-line"></div>
        <h1>About Us</h1>
        <p className="subtitle">The story of Kalakritam</p>
        <div className="about-content">
          <p>Discover the journey and vision behind Kalakritam, where art meets excellence.</p>
          <p>Our commitment to creativity and innovation drives everything we do.</p>
        </div>
        <div className="decorative-line"></div>
      </div>
    </div>
  );
};

export default AboutUs;
