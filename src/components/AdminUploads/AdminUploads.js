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



  const toggleVisibility = async (artToToggle) => {
    // Optimistically update the UI
    setArts(arts.map(art => 
      art.id === artToToggle.id ? { ...art, is_visible: !art.is_visible } : art
    ));

    console.log('Attempting to toggle visibility for:', artToToggle.name, 'from', artToToggle.is_visible, 'to', !artToToggle.is_visible);
    console.log('Before Supabase update, art.is_visible:', artToToggle.is_visible);

    try {
      const { error } = await supabase
        .from('arts')
        .update({ is_visible: !artToToggle.is_visible })
        .eq('id', artToToggle.id);

      if (error) {
        // If the update fails, revert the UI change
        setArts(arts.map(art => 
          art.id === artToToggle.id ? { ...art, is_visible: artToToggle.is_visible } : art
        ));
        throw error;
      } 

      setMessage(`Art "${artToToggle.name}" visibility updated.`);
      console.log('Supabase update successful for:', artToToggle.name);
      console.log('After Supabase update, new is_visible state:', !artToToggle.is_visible);

    } catch (error) {
      console.error('Supabase update failed with error:', error);
      console.log('Reverting UI and re-fetching arts due to error.');
      setMessage('Error updating art visibility. Please try again.');
      // Fetch from server to ensure UI consistency after an error
      fetchArts(); 
    }
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

  const confirmDelete = (art) => {
    setSelectedArt(art);
    setShowConfirmation(true);
  };

  const cancelDelete = () => {
    setSelectedArt(null);
    setShowConfirmation(false);
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
            <div className="visibility-toggle" onClick={() => toggleVisibility(art)}>
              <div className={`switch ${art.is_visible ? 'on' : 'off'}`}>
                <div className="slider"></div>
              </div>
              <span className='toggle-label'>{art.is_visible ? 'Visible' : 'Hidden'}</span>
            </div>
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
