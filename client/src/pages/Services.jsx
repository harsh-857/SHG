import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import ChatWindow from '../components/ChatWindow';
import AppointmentModal from '../components/AppointmentModal';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Services = () => {
    const { user: currentUser } = useAuth();
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [showChat, setShowChat] = useState(false);
    const [chatPartner, setChatPartner] = useState(null);
    const navigate = useNavigate();

    const categories = [
        'Housekeeping Services',
        'Beauty Parlour Course / Services',
        'Tailoring Services',
        'Papad and Pickle Making'
    ];

    const fetchProviders = async (category) => {
        setLoading(true);
        setSelectedCategory(category);
        try {
            const village = currentUser?.village || '';
            const block = currentUser?.block || '';

            const res = await api.get(`/services/search?category=${encodeURIComponent(category)}&village=${encodeURIComponent(village)}&block=${encodeURIComponent(block)}`);
            setProviders(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const [showAppointmentModal, setShowAppointmentModal] = useState(false);
    const [appointmentProvider, setAppointmentProvider] = useState(null);

    const handleConnect = (provider) => {
        if (!currentUser) {
            navigate('/login-select');
            return;
        }
        setChatPartner(provider);
        setShowChat(true);
    };

    const handleBook = (provider) => {
        if (!currentUser) {
            navigate('/login-select');
            return;
        }
        setAppointmentProvider(provider);
        setShowAppointmentModal(true);
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h1>Find Services in Your District (Muzaffarnagar)</h1>
            <p className="mb-4">Select a service to find SHG providers near you.</p>

            {/* Category Buttons */}
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '30px' }}>
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => fetchProviders(cat)}
                        className={`btn ${selectedCategory === cat ? 'active' : ''}`}
                        style={{
                            backgroundColor: selectedCategory === cat ? '#0000cc' : '#333',
                            flex: '1 1 200px'
                        }}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Results Area */}
            {selectedCategory && (
                <div>
                    <h2>{selectedCategory} Providers</h2>
                    {loading ? <p>Loading...</p> : (
                        providers.length === 0 ? <p>No providers found for this category yet.</p> : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                                {providers.map(provider => (
                                    <div key={provider._id} className="card">
                                        <h3>{provider.name}</h3>
                                        <p><strong>Village:</strong> {provider.village}</p>
                                        <p><strong>Block:</strong> {provider.block}</p>

                                        {/* Highlight location match */}
                                        {currentUser && (
                                            <div style={{ fontSize: '0.85rem', color: '#555', marginBottom: '10px' }}>
                                                {provider.village?.toLowerCase() === currentUser.village?.toLowerCase() ?
                                                    <span style={{ color: 'green', fontWeight: 'bold' }}>✓ Same Village</span> :
                                                    (provider.block?.toLowerCase() === currentUser.block?.toLowerCase() ?
                                                        <span style={{ color: 'blue' }}>✓ Same Block</span> :
                                                        'District Provider'
                                                    )
                                                }
                                            </div>
                                        )}

                                        <button
                                            className="btn"
                                            style={{ width: '100%', marginTop: '10px' }}
                                            onClick={() => handleConnect(provider)}
                                        >
                                            Message / Connect
                                        </button>
                                        <button
                                            className="btn"
                                            style={{ width: '100%', marginTop: '5px', backgroundColor: '#28a745' }}
                                            onClick={() => handleBook(provider)}
                                        >
                                            Book Appointment
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )
                    )}
                </div>
            )}

            {!selectedCategory && (
                <div className="card" style={{ marginTop: '30px', textAlign: 'center', color: '#666' }}>
                    Select a category above to view providers. <br />
                    Results are automatically sorted to show providers in your <strong>Village</strong> and <strong>Block</strong> first.
                </div>
            )}

            {/* Modals */}
            {showChat && chatPartner && currentUser && (
                <ChatWindow
                    currentUser={currentUser}
                    otherUser={chatPartner}
                    onClose={() => setShowChat(false)}
                />
            )}

            {showAppointmentModal && appointmentProvider && currentUser && (
                <AppointmentModal
                    provider={appointmentProvider}
                    onClose={() => setShowAppointmentModal(false)}
                />
            )}
        </div>
    );
};

export default Services;

