import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import ChatWindow from '../components/ChatWindow';

const SHGDashboard = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    const [appointments, setAppointments] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [activeTab, setActiveTab] = useState('appointments'); // 'appointments' or 'chats'
    const [selectedChatUser, setSelectedChatUser] = useState(null);

    useEffect(() => {
        if (!loading && (!user || user.role !== 'shg')) {
            navigate('/login');
        }
    }, [user, loading, navigate]);

    useEffect(() => {
        if (user && user.role === 'shg') {
            fetchAppointments();
            fetchConversations();

            // Polling for new messages/appointments could be added here, 
            // or we rely on socket events if we connect the dashboard to socket.io
            const interval = setInterval(() => {
                fetchConversations();
            }, 10000); // refresh unread counts every 10s

            return () => clearInterval(interval);
        }
    }, [user]);

    const fetchAppointments = async () => {
        try {
            const res = await api.get('/appointments/my-appointments');
            setAppointments(res.data);
        } catch (error) {
            console.error("Error fetching appointments:", error);
        }
    };

    const handleUpdateAppointmentStatus = async (appointmentId, newStatus) => {
        try {
            await api.put(`/appointments/${appointmentId}/status`, { status: newStatus });
            fetchAppointments(); // Refresh list after update
        } catch (error) {
            console.error(`Error updating appointment to ${newStatus}:`, error);
            alert('Failed to update appointment. Please try again.');
        }
    };

    const fetchConversations = async () => {
        try {
            const res = await api.get('/chat/conversations');
            setConversations(res.data);
        } catch (error) {
            console.error("Error fetching conversations:", error);
        }
    };

    const handleOpenChat = (conv) => {
        // Mark as read immediately in UI
        const updatedConvs = conversations.map(c =>
            c.otherUserId === conv.otherUserId ? { ...c, unreadCount: 0 } : c
        );
        setConversations(updatedConvs);

        setSelectedChatUser({
            _id: conv.otherUserId,
            name: conv.otherUserDetail ? conv.otherUserDetail.name : 'User',
            role: conv.otherUserModel === 'SHGProvider' ? 'shg' : 'user'
        });
    };

    if (loading) return <p>Loading...</p>;
    if (!user) return null;

    return (
        <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
            <div className='card' style={{ marginBottom: '20px' }}>
                <h2>SHG Profile</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                    <div>
                        <p><strong>Name:</strong> {user.name}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                    </div>
                    <div>
                        <p><strong>Category:</strong> {user.serviceCategory}</p>
                        <p><strong>Location:</strong> {user.village}, {user.block}</p>
                        <p><strong>Status:</strong> <span style={{ color: 'green', fontWeight: 'bold' }}>Approved</span></p>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <button
                    className='btn'
                    style={{ backgroundColor: activeTab === 'appointments' ? '#0000FF' : '#666' }}
                    onClick={() => setActiveTab('appointments')}
                >
                    View Appointments
                </button>
                <button
                    className='btn'
                    style={{ backgroundColor: activeTab === 'chats' ? '#0000FF' : '#666', position: 'relative' }}
                    onClick={() => setActiveTab('chats')}
                >
                    Messages
                    {conversations.some(c => c.unreadCount > 0) && (
                        <span style={{
                            position: 'absolute',
                            top: '-8px',
                            right: '-8px',
                            backgroundColor: '#333',
                            color: 'white',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            boxShadow: '0 0 0 4px rgba(0, 0, 0, 0.1)',
                            animation: 'pulse 2s infinite'
                        }}>
                            {conversations.reduce((acc, curr) => acc + (curr.unreadCount || 0), 0)}
                        </span>
                    )}
                </button>
            </div>

            {activeTab === 'appointments' && (
                <div>
                    <div className='card' style={{ marginBottom: '20px' }}>
                        <h3>Pending Requests</h3>
                        {appointments.filter(a => a.status === 'pending').length === 0 ? (
                            <p>No pending appointment requests.</p>
                        ) : (
                            <div className="table-responsive">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>TimeSlot</th>
                                            <th>Consumer Name</th>
                                            <th>Contact Email</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {appointments.filter(a => a.status === 'pending').map((app) => (
                                            <tr key={app._id}>
                                                <td>{app.date}</td>
                                                <td>{app.timeSlot}</td>
                                                <td>{app.consumer?.name || 'Unknown'}</td>
                                                <td>{app.consumer?.email || 'N/A'}</td>
                                                <td>
                                                    <span style={{
                                                        color: app.status === 'confirmed' ? 'var(--gov-blue)' :
                                                            app.status === 'completed' ? '#2ecc71' :
                                                                app.status === 'cancelled' ? '#e74c3c' : '#f39c12'
                                                    }}>
                                                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                                    </span>
                                                    {app.status === 'pending' && (
                                                        <div style={{ marginTop: '5px' }}>
                                                            <button
                                                                style={{ background: 'green', color: 'white', border: 'none', padding: '4px 8px', marginRight: '5px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                                                                onClick={() => handleUpdateAppointmentStatus(app._id, 'confirmed')}
                                                            >
                                                                Approve
                                                            </button>
                                                            <button
                                                                style={{ background: 'red', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                                                                onClick={() => handleUpdateAppointmentStatus(app._id, 'cancelled')}
                                                            >
                                                                Reject
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    <div className='card'>
                        <h3>Upcoming Schedule</h3>
                        {appointments.filter(a => a.status === 'confirmed').length === 0 ? (
                            <p>No upcoming schedules.</p>
                        ) : (
                            <div className="table-responsive">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>TimeSlot</th>
                                            <th>Consumer Name</th>
                                            <th>Contact Email</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {appointments.filter(a => a.status === 'confirmed').map((app) => (
                                            <tr key={app._id}>
                                                <td>{app.date}</td>
                                                <td>{app.timeSlot}</td>
                                                <td>{app.consumer?.name || 'Unknown'}</td>
                                                <td>{app.consumer?.email || 'N/A'}</td>
                                                <td>
                                                    <span style={{ color: 'green', fontWeight: 'bold' }}>Confirmed</span>
                                                    <div style={{ marginTop: '5px' }}>
                                                        <button
                                                            style={{ background: 'blue', color: 'white', border: 'none', padding: '4px 8px', marginRight: '5px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                                                            onClick={() => handleUpdateAppointmentStatus(app._id, 'completed')}
                                                        >
                                                            Mark Done
                                                        </button>
                                                        <button
                                                            style={{ background: 'red', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                                                            onClick={() => handleUpdateAppointmentStatus(app._id, 'cancelled')}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'chats' && (
                <div className='card'>
                    <h3>Conversations</h3>
                    {conversations.length === 0 ? (
                        <p>No messages yet.</p>
                    ) : (
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {conversations.map((conv) => (
                                <li key={conv.otherUserId} style={{
                                    padding: '15px', borderBottom: '1px solid #eee',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    backgroundColor: conv.unreadCount > 0 ? '#f0f8ff' : 'transparent',
                                    cursor: 'pointer'
                                }} onClick={() => handleOpenChat(conv)}>
                                    <div>
                                        <h4 style={{ margin: '0 0 5px 0' }}>
                                            {conv.otherUserDetail ? conv.otherUserDetail.name : 'Loading...'}
                                        </h4>
                                        <p style={{ margin: 0, color: '#666', fontSize: '0.9em', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '300px' }}>
                                            {conv.lastMessage.sender === user._id ? 'You: ' : ''}
                                            {conv.lastMessage.content}
                                        </p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <span style={{ fontSize: '0.8em', color: '#999', display: 'block' }}>
                                            {new Date(conv.lastMessage.timestamp).toLocaleDateString()}
                                        </span>
                                        {conv.unreadCount > 0 && (
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '5px',
                                                marginTop: '8px',
                                                color: '#ff4757',
                                                fontWeight: 'bold',
                                                fontSize: '0.85rem'
                                            }}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ animation: 'pulse 1.5s infinite' }}>
                                                    <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 18H4V8L12 13L20 8V18ZM12 11L4 6H20L12 11Z" />
                                                </svg>
                                                <span>{conv.unreadCount} new</span>
                                            </div>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {selectedChatUser && (
                <ChatWindow
                    currentUser={user}
                    otherUser={selectedChatUser}
                    onClose={() => {
                        setSelectedChatUser(null);
                        fetchConversations(); // Refresh counts when closing
                    }}
                />
            )}
        </div>
    );
};

export default SHGDashboard;
