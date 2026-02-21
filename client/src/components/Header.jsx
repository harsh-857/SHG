import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const onLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="header-container">
            <div className="nav-strip">
                <Link to="/">Government of Uttar Pradesh</Link>
                <div style={{ float: 'right' }}>
                    Select Language: English | <a href="#">Hindi</a>
                </div>
            </div>

            <header className="header">
                <div className="logo">
                    <img src="/src/assets/logo.jpg" alt="Emblem" style={{ height: '80px', borderRadius: '50%' }} />
                    <div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>SHUKTEERTH SHUDDHA</div>
                        <div style={{ fontSize: '0.8rem', color: '#555' }}>Government of Uttar Pradesh</div>
                    </div>
                </div>
            </header>

            <nav className="navbar">
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about">About SHG Platform</Link></li>
                    <li><Link to="/services">Services</Link></li>
                    <li><a href="https://muzaffarnagar.nic.in/" target="_blank" rel="noopener noreferrer">District Profile</a></li>

                    {user ? (
                        <>
                            {user.role === 'admin' && <li><Link to='/admin'>Admin</Link></li>}
                            {user.role === 'shg' && <li><Link to='/shg-dashboard'>Dashboard</Link></li>}
                            <li><button onClick={onLogout} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: '0', font: 'inherit' }}>Logout</button></li>
                        </>
                    ) : (
                        <>
                            <li><Link to='/register-select'>Register</Link></li>
                            <li><Link to='/login-select'>Login</Link></li>
                        </>
                    )}
                </ul>
            </nav>
        </div>
    );
};

export default Header;
