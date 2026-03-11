import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginSelect = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && user) {
            if (user.role === 'admin') navigate('/admin', { replace: true });
            else if (user.role === 'shg') navigate('/shg-dashboard', { replace: true });
            else navigate('/services', { replace: true });
        }
    }, [user, loading, navigate]);

    return (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <h2>Login</h2>
            <p>Please select your role to proceed.</p>
            <div className="btn-group-responsive">
                <Link to="/login?role=consumer" className="btn">
                    Login as User
                </Link>
                <Link to="/login?role=shg" className="btn" style={{ backgroundColor: '#555' }}>
                    Login as SHG Member
                </Link>
            </div>
            <div style={{ marginTop: '20px' }}>
                <Link to="/admin" style={{ color: '#333', fontSize: '0.9rem' }}>Admin Login</Link>
            </div>
        </div>
    );
};

export default LoginSelect;
