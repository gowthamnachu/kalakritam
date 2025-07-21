import React, { useState, useEffect } from 'react';
import supabase from '../../supabaseClient';
import './AdminUploads.css';

const AdminUploads = () => {
  const [arts, setArts] = useState([]);
  const [message, setMessage] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
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
      setMessage('Error fetching arts. Please try again.');
      setLoading(false);
    }
  };

  const confirmDelete = (art) => {
    setSelectedArt(art);
    setShowConfirmation(true);
  };

  const cancelDelete = () => {
    setSelectedArt(null);
    setShowConfirmation(false);
  };

  const handleDelete = async (art) => {
    try {
      // 1. Delete the image from storage
      const { error: storageError } = await supabase.storage
        .from('art-images')
        .remove([art.image_url]);

      if (storageError) throw storageError;

      // 2. Delete the database entry
      const { error: deleteError } = await supabase
        .from('arts')
        .delete()
        .match({ id: art.id });

      if (deleteError) throw deleteError;

      setMessage('Art deleted successfully! This action cannot be undone.');
      fetchArts();
    } catch (error) {
      console.error('Error deleting art:', error);
      setMessage('Error deleting art. Please try again.');
    } finally {
      setShowConfirmation(false);
      setSelectedArt(null);
    }
  };

  if (loading) {
    return <div className="admin-uploads-container">Loading...</div>;
  }

  return (
    <div className="admin-uploads-container">
      <h1>Uploaded Arts</h1>
      {message && <p className="message">{message}</p>}
      
      <div className="arts-grid">
        {arts.map(art => (
          <div key={art.id} className="art-card">
            <img 
              src={`${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/art-images/${art.image_url}`}
              alt={art.name} 
            />
            <h3>{art.name}</h3>
            <p>{art.description}</p>
            <p className="artist">By: {art.artist}</p>
            <button 
              className="delete-btn"
              onClick={() => confirmDelete(art)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {showConfirmation && selectedArt && (
        <div className="confirmation-modal">
          <div className="modal-content">
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete "{selectedArt.name}"?</p>
            <p className="warning">This action cannot be undone!</p>
            <div className="modal-buttons">
              <button 
                className="confirm-btn"
                onClick={() => handleDelete(selectedArt)}
              >
                Yes, Delete
              </button>
              <button 
                className="cancel-btn"
                onClick={cancelDelete}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUploads;
