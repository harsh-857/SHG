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
                            position: 'absolute', top: '-5px', right: '-5px',
                            backgroundColor: 'red', color: 'white', borderRadius: '50%',
                            padding: '2px 6px', fontSize: '0.7em', fontWeight: 'bold'
                        }}>
                            {conversations.reduce((acc, c) => acc + c.unreadCount, 0)}
                        </span>
                    )}
                </button>
            </div>

            {activeTab === 'appointments' && (
                <div className='card'>
                    <h3>Appointments</h3>
                    {appointments.length === 0 ? (
                        <p>No appointments booked yet.</p>
                    ) : (
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
                                {appointments.map((app) => (
                                    <tr key={app._id}>
                                        <td>{app.date}</td>
                                        <td>{app.timeSlot}</td>
                                        <td>{app.consumer?.name || 'Unknown'}</td>
                                        <td>{app.consumer?.email || 'N/A'}</td>
                                        <td>
                                            <span style={{
                                                color: app.status === 'confirmed' ? 'green' :
                                                    app.status === 'completed' ? 'blue' :
                                                        app.status === 'cancelled' ? 'red' : 'orange'
                                            }}>
                                                {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
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
                                            <span style={{
                                                backgroundColor: 'red', color: 'white', borderRadius: '10px',
                                                padding: '2px 8px', fontSize: '0.8em', fontWeight: 'bold',
                                                display: 'inline-block', marginTop: '5px'
                                            }}>
                                                {conv.unreadCount} new
                                            </span>
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
