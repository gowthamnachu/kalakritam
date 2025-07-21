import React, { useState, useEffect } from 'react';
import supabase from '../../supabaseClient';
import './AdminArts.css';

const AdminArts = () => {
  const [arts, setArts] = useState([]);
  const [newArt, setNewArt] = useState({
    name: '',
    description: '',
    artist: '',
    image: null
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
  }, []);

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
    } catch (error) {
      console.error('Error fetching arts:', error);
      setMessage('Error fetching arts. Please try again.');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewArt(prev => ({ ...prev, image: file }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewArt(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (!user) {
        throw new Error('You must be logged in to upload art.');
      }

      if (!newArt.image || !newArt.name || !newArt.description || !newArt.artist) {
        throw new Error('Please fill in all fields and select an image.');
      }

      // Validate file size and type
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (newArt.image.size > maxSize) {
        throw new Error('Image size must be less than 5MB');
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(newArt.image.type)) {
        throw new Error('Please upload a JPEG, PNG, or GIF image');
      }

      // 1. Upload image to storage
      const fileExt = newArt.image.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      console.log('Uploading file:', {
        fileName,
        fileSize: newArt.image.size,
        fileType: newArt.image.type,
        userId: user.id
      });

      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('art-images')
        .upload(fileName, newArt.image, {
          cacheControl: '3600',
          upsert: false,
          contentType: newArt.image.type
        });

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw new Error(`Failed to upload image: ${uploadError.message}`);
      }

      console.log('File uploaded successfully:', uploadData);

      // 2. Create database entry
      const imageUrl = uploadData.path;
      const { error: insertError, data: insertData } = await supabase
        .from('arts')
        .insert([{
          name: newArt.name,
          description: newArt.description,
          artist: newArt.artist,
          image_url: imageUrl
        }])
        .select();

      if (insertError) {
        // If database insert fails, clean up the uploaded file
        await supabase.storage
          .from('art-images')
          .remove([imageUrl]);
        console.error('Database insert error:', insertError);
        throw new Error(`Failed to save art details: ${insertError.message}`);
      }

      console.log('Database entry created:', insertData);

      setMessage('Art uploaded successfully!');
      setNewArt({ name: '', description: '', artist: '', image: null });
      fetchArts();
    } catch (error) {
      console.error('Error uploading art:', error);
      setMessage(error.message || 'Error uploading art. Please try again.');
    } finally {
      setLoading(false);
      // Reset file input
      const fileInput = document.getElementById('image');
      if (fileInput) {
        fileInput.value = '';
      }
    }
  };

  const deleteArt = async (id, imageUrl) => {
    try {
      if (!user) {
        throw new Error('You must be logged in to delete art.');
      }

      // 1. Delete the image from storage
      const { error: storageError } = await supabase.storage
        .from('art-images')
        .remove([imageUrl]);

      if (storageError) throw storageError;

      // 2. Delete the database entry
      const { error: deleteError } = await supabase
        .from('arts')
        .delete()
        .match({ id });

      if (deleteError) throw deleteError;

      setMessage('Art deleted successfully!');
      fetchArts();
    } catch (error) {
      console.error('Error deleting art:', error);
      setMessage(error.message || 'Error deleting art. Please try again.');
    }
  };

  return (
    <div className="admin-arts-container">
      <h1>Art Management</h1>
      
      <div className="upload-section">
        <h2>Upload New Art</h2>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleSubmit} className="art-form">
          <div className="form-group">
            <label htmlFor="name">Art Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={newArt.name}
              onChange={handleInputChange}
              placeholder="Enter art name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={newArt.description}
              onChange={handleInputChange}
              placeholder="Enter art description"
            />
          </div>

          <div className="form-group">
            <label htmlFor="artist">Artist</label>
            <input
              type="text"
              id="artist"
              name="artist"
              value={newArt.artist}
              onChange={handleInputChange}
              placeholder="Enter artist name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Art Image</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Uploading...' : 'Upload Art'}
          </button>
        </form>
      </div>

      <div className="arts-list">
        <h2>Uploaded Arts</h2>
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
                onClick={() => deleteArt(art.id, art.image_url)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminArts;
