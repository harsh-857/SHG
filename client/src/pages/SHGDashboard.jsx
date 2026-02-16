import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SHGDashboard = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser || storedUser.role !== 'shg') {
            navigate('/login');
        } else {
            setUser(storedUser);
        }
    }, [navigate]);

    if (!user) return null;

    return (
        <div>
            <h1>SHG Provider Dashboard</h1>
            <div className="card">
                <h2>Welcome, {user.name}</h2>
                <p>Status: <span style={{ color: 'green', fontWeight: 'bold' }}>Active & Verified</span></p>
                <p>Your Service Category: <strong>{user.serviceCategory}</strong> (Need to fetch full profile to show this if not in token, but assuming basic access for now)</p>

                <h3>Manage Services</h3>
                <p>You can receive service requests from this panel (Feature coming soon).</p>
            </div>
        </div>
    );
};

export default SHGDashboard;
