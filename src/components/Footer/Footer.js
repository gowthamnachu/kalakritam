import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    const location = useLocation();
    const isAdminLoginPage = location.pathname === '/admin';

    return (
        <footer className="footer-container">
            <div className="footer-content">
                <p>&copy; {new Date().getFullYear()} Kalakritam. All rights reserved.</p>
                {isAdminLoginPage && (
                    <Link to="/admin" className="admin-login-button-footer">Admin Login</Link>
                )}
            </div>
        </footer>
    );
};

export default Footer;