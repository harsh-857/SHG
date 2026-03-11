import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const MyBookings = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
            return;
        }
        if (!loading && user && user.role !== 'consumer') {
            navigate('/');
            return;
        }

        const fetchAppointments = async () => {
            try {
                const res = await api.get('/appointments/my-appointments');
                setAppointments(res.data);
                setFetching(false);
            } catch (err) {
                console.error("Error fetching bookings:", err);
                setError('Failed to load your bookings. Please try again.');
                setFetching(false);
            }
        };

        if (user) {
            fetchAppointments();
        }
    }, [user, loading, navigate]);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending':
                return <span style={{ padding: '4px 10px', backgroundColor: '#f39c12', color: 'white', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' }}>Pending</span>;
            case 'confirmed':
                return <span style={{ padding: '4px 10px', backgroundColor: '#27ae60', color: 'white', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' }}>Confirmed</span>;
            case 'completed':
                return <span style={{ padding: '4px 10px', backgroundColor: '#2980b9', color: 'white', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' }}>Completed</span>;
            case 'cancelled':
                return <span style={{ padding: '4px 10px', backgroundColor: '#e74c3c', color: 'white', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' }}>Cancelled/Rejected</span>;
            default:
                return <span style={{ padding: '4px 10px', backgroundColor: '#95a5a6', color: 'white', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' }}>{status}</span>;
        }
    };

    if (loading || fetching) {
        return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading bookings...</div>;
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2>My Bookings</h2>
            <p>Track the status of your requested SHG services.</p>

            {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

            {appointments.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
                    <p>You haven't booked any services yet.</p>
                    <button className="btn" onClick={() => navigate('/services')} style={{ marginTop: '15px' }}>Explore Services</button>
                </div>
            ) : (
                <div className="grid">
                    {appointments.map((apt) => (
                        <div key={apt._id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                                <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--gov-slate)' }}>{apt.provider?.serviceCategory || 'Service'}</h3>
                                {getStatusBadge(apt.status)}
                            </div>

                            <div style={{ marginTop: '5px' }}>
                                <strong>Provider:</strong> {apt.provider?.name || 'Unknown'}
                            </div>
                            <div>
                                <strong>Date:</strong> {new Date(apt.date).toLocaleDateString('en-GB')}
                            </div>
                            <div>
                                <strong>Time:</strong> {apt.timeSlot}
                            </div>

                            <div style={{ marginTop: '10px', fontSize: '0.9rem', color: '#666' }}>
                                <em>Booked on: {new Date(apt.createdAt).toLocaleDateString('en-GB')}</em>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookings;
