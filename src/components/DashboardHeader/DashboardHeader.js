import React, { useState, useEffect } from 'react';
import './DashboardHeader.css';
import { Link, useNavigate } from 'react-router-dom';
import supabase from '../../supabaseClient';

const DashboardHeader = () => {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    const handleClickOutside = (event) => {
      if (!event.target.closest('.arts-dropdown') && !event.target.closest('.menu-dropdown')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    
    return () => {
      subscription.unsubscribe();
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/home');
  };

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <img src="/images/kalakritam1-logo.png" className="small-logo" alt="Custom Logo" />
      </div>
      <div className="header-center">
        <img src="/images/kalakritam-logo.png" className="kalakritam-logo" alt="Kalakritam" />
      </div>
      <div className="header-right">
        {user ? (
          <div className="admin-controls">
            <div className="arts-dropdown">
              <button 
                className="arts-dropdown-button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDropdown(!showDropdown);
                }}
              >
                Arts Menu ▼
              </button>
              {showDropdown && (
                <div className="dropdown-content">
                  <Link 
                    to="/admin-arts" 
                    className="dropdown-item"
                    onClick={() => setShowDropdown(false)}
                  >
                    Manage Arts
                  </Link>
                  <Link 
                    to="/admin-uploads" 
                    className="dropdown-item"
                    onClick={() => setShowDropdown(false)}
                  >
                    Uploaded Arts
                  </Link>
                </div>
              )}
            </div>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        ) : (
          <div className="user-controls">
            <div className="menu-dropdown">
              <button 
                className="menu-button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDropdown(!showDropdown);
                }}
              >
                Menu ▼
              </button>
              {showDropdown && (
                <div className="menu-content">
                  <Link 
                    to="/home" 
                    className="menu-item"
                    onClick={() => setShowDropdown(false)}
                  >
                    Home
                  </Link>
                  <Link 
                    to="/arts" 
                    className="menu-item"
                    onClick={() => setShowDropdown(false)}
                  >
                    Our Arts
                  </Link>
                  <Link 
                    to="/events" 
                    className="menu-item"
                    onClick={() => setShowDropdown(false)}
                  >
                    Events
                  </Link>
                  <Link 
                    to="/about" 
                    className="menu-item"
                    onClick={() => setShowDropdown(false)}
                  >
                    About Us
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </header>
  );
};

export default DashboardHeader;