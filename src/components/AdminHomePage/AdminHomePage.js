import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import supabase from '../../supabaseClient';
import './AdminHomePage.css';

const AdminHomePage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();
  }, []);
  return (
    <div className="admin-home-container">
      <h1>Welcome, {user ? user.email : 'Admin'}!</h1>
      <div className="admin-actions">
        <Link to="/admin-arts" className="admin-action-button">
          Manage Arts
        </Link>
      </div>
    </div>
  );
};

export default AdminHomePage;