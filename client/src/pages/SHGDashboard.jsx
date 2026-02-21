import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SHGDashboard = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && (!user || user.role !== 'shg')) {
            navigate('/login');
        }
    }, [user, loading, navigate]);

    if (loading) return <p>Loading...</p>;
    if (!user) return null;

    return (
        <div className='card' style={{ maxWidth: '600px', margin: '20px auto' }}>
            <h2>SHG Dashboard</h2>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Category:</strong> {user.serviceCategory}</p>
            <p><strong>Location:</strong> {user.village}, {user.block}</p>
            <p><strong>Status:</strong> <span style={{ color: 'green', fontWeight: 'bold' }}>Approved</span></p>

            <div style={{ marginTop: '20px' }}>
                <h3>Actions</h3>
                <button className='btn' style={{ marginRight: '10px' }}>View Appointments</button>
                <button className='btn'>Edit Profile</button>
            </div>
        </div>
    );
};

export default SHGDashboard;
