import React from 'react';
import { useNavigate } from 'react-router-dom';
import './IntroVideo.css';

const IntroVideo = () => {
  const navigate = useNavigate();

  const handleVideoEnd = () => {
    navigate('/home');
  };

  return (
    <div className="intro-video-container">
      <video autoPlay muted className="intro-video" onEnded={handleVideoEnd}>
        <source src="/videos/intro.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default IntroVideo;