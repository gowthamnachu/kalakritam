import React, { useState, useEffect } from 'react';
import supabase from '../../supabaseClient';
import './Arts.css';

const Arts = () => {
  const [arts, setArts] = useState([]);
  const [selectedArt, setSelectedArt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArts();
  }, []);

  const fetchArts = async () => {
    try {
      const { data, error } = await supabase
        .from('arts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setArts(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching arts:', error);
      setLoading(false);
    }
  };

  return (
    <div className="arts-container">
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
        <h1>Our Arts</h1>
        <p className="subtitle">Discover our artistic creations</p>
        <div className="arts-gallery">
          {loading ? (
            <div className="loading">Loading arts...</div>
          ) : arts.length > 0 ? (
            <div className="arts-grid">
              {arts.map((art) => (
                <div key={art.id} className="art-card" onClick={() => setSelectedArt(art)}>
                  <div className="art-image-container">
                    <img 
                      src={`${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/art-images/${art.image_url}`} 
                      alt={art.name}
                    />
                    <div className="view-overlay">
                      <span className="view-icon">👁️</span>
                    </div>
                  </div>
                  <h3>{art.name}</h3>
                  <p className="artist">By {art.artist}</p>
                  <p className="description">{art.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-arts">No artworks available at the moment.</p>
          )}
        </div>
        <div className="decorative-line"></div>
      </div>

      {selectedArt && (
        <div className="art-modal" onClick={() => setSelectedArt(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-button" onClick={() => setSelectedArt(null)}>×</button>
            <img 
              src={`${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/art-images/${selectedArt.image_url}`} 
              alt={selectedArt.name}
            />
            <div className="modal-info">
              <h2>{selectedArt.name}</h2>
              <p className="artist">By {selectedArt.artist}</p>
              <p className="description">{selectedArt.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Arts;
