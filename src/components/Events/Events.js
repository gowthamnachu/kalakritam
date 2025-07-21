import React from 'react';
import './Events.css';

const Events = () => {
  return (
    <div className="events-container">
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
        <h1>Events</h1>
        <p className="subtitle">Join our upcoming exhibitions and showcases</p>
        <div className="events-content">
          <p>Stay tuned for our exciting events and art exhibitions.</p>
          {/* Add events content here */}
        </div>
        <div className="decorative-line"></div>
      </div>
    </div>
  );
};

export default Events;
