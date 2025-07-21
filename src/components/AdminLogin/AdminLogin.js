import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';
import supabase from '../../supabaseClient';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage('Error logging in: ' + error.message);
    } else {
      setMessage('Logged in successfully!');
      navigate('/admin-home');
    }
  };

  return (
    <div className="admin-login-container">
      <div className="art-border top"></div>
      <div className="art-border bottom"></div>
      <div className="art-border left"></div>
      <div className="art-border right"></div>
      
      <div className="corner-art top-left"></div>
      <div className="corner-art top-right"></div>
      <div className="corner-art bottom-left"></div>
      <div className="corner-art bottom-right"></div>

      <div className="login-form-section">
        <div className="decorative-line"></div>
        <h1>Admin Only!</h1>
        {message && <p className="login-message">{message}</p>}
        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group" style={{animationDelay: '0.3s'}}>
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group" style={{animationDelay: '0.5s'}}>
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="login-button">
            Access Portal
          </button>
        </form>
        <div className="decorative-line"></div>
      </div>
    </div>
  );
};

export default AdminLogin;