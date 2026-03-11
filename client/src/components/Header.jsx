import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import logoImg from '../assets/logo.jpg';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const onLogout = () => {
        logout();
        setIsMenuOpen(false);
        navigate('/');
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <div className="header-container">
            <div className="nav-strip">
                <Link to="/">Government of Uttar Pradesh</Link>
                <div style={{ float: 'right' }} className="hide-mobile">
                    Select Language: English | <a href="#">Hindi</a>
                </div>
            </div>

            <header className="header">
                <div className="logo">
                    <img src={logoImg} alt="Emblem" style={{ height: '80px', borderRadius: '50%', transition: 'height 0.3s' }} />
                    <div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>SHUKTEERTH SHUDDHA</div>
                        <div style={{ fontSize: '0.8rem', color: '#555' }}>Government of Uttar Pradesh</div>
                    </div>
                </div>

                <button className="mobile-menu-btn" onClick={toggleMenu} style={{
                    display: 'none',
                    background: 'none',
                    border: 'none',
                    fontSize: '2rem',
                    cursor: 'pointer'
                }}>
                    {isMenuOpen ? '✕' : '☰'}
                </button>
            </header>

            <nav className="navbar">
                <ul className={isMenuOpen ? 'active' : ''}>
                    <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
                    <li><Link to="/about" onClick={() => setIsMenuOpen(false)}>About SHG Platform</Link></li>
                    <li><Link to="/services" onClick={() => setIsMenuOpen(false)}>Services</Link></li>
                    <li><a href="https://muzaffarnagar.nic.in/" target="_blank" rel="noopener noreferrer">District Profile</a></li>

                    {user ? (
                        <>
                            <li><Link to='/profile' onClick={() => setIsMenuOpen(false)}>Profile</Link></li>
                            {user.role === 'admin' && <li><Link to='/admin' onClick={() => setIsMenuOpen(false)}>Admin</Link></li>}
                            {user.role === 'shg' && <li><Link to='/shg-dashboard' onClick={() => setIsMenuOpen(false)}>Dashboard</Link></li>}
                            {user.role === 'consumer' && <li><Link to='/my-bookings' onClick={() => setIsMenuOpen(false)}>My Bookings</Link></li>}
                            <li><button onClick={onLogout} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: '15px 20px', font: 'inherit', width: '100%', textAlign: 'center' }}>Logout</button></li>
                        </>
                    ) : (
                        <>
                            <li><Link to='/register-select' onClick={() => setIsMenuOpen(false)}>Register</Link></li>
                            <li><Link to='/login-select' onClick={() => setIsMenuOpen(false)}>Login</Link></li>
                        </>
                    )}
                </ul>
            </nav>
            <style>{`
                @media (max-width: 768px) {
                    .mobile-menu-btn { display: block !important; }
                    .nav-strip .hide-mobile { display: none; }
                }
            `}</style>
        </div>
    );
};

export default Header;
