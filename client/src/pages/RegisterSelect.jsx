import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterSelect = () => {
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
            <h2>Register</h2>
            <p>Join the platform. Choose your registration type.</p>
            <div className="btn-group-responsive">
                <Link to="/register-consumer" className="btn">
                    Register as User
                </Link>
                <Link to="/register-shg" className="btn" style={{ backgroundColor: '#555' }}>
                    Register as SHG Member
                </Link>
            </div>
        </div>
    );
};

export default RegisterSelect;
