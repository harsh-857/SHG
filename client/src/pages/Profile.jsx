import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, loading, login } = useAuth(); // use login to refresh context user data
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        profilePicture: ''
    });
    const [previewUrl, setPreviewUrl] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        } else if (user) {
            setFormData({
                name: user.name || '',
                profilePicture: user.profilePicture || ''
            });
            setPreviewUrl(user.profilePicture || '');
        }
    }, [user, loading, navigate]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setStatusMessage('File size exceeds 5MB limit.');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
                setFormData({ ...formData, profilePicture: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setStatusMessage('');

        try {
            const res = await api.put('/auth/profile', formData);

            // Re-hydrate the Auth context to reflect changes globally
            const token = localStorage.getItem('token');
            login(token, res.data);

            setStatusMessage('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            setStatusMessage('Failed to update profile.');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading || !user) return <p>Loading...</p>;

    return (
        <div className="card" style={{ maxWidth: '500px', margin: '40px auto' }}>
            <h2>Edit Profile</h2>
            {statusMessage && (
                <div style={{
                    padding: '10px',
                    marginBottom: '15px',
                    backgroundColor: statusMessage.includes('success') ? 'rgba(39, 174, 96, 0.1)' : '#f8d7da',
                    color: statusMessage.includes('success') ? 'var(--gov-blue)' : '#721c24',
                    borderRadius: '8px',
                    border: statusMessage.includes('success') ? '1px solid rgba(39, 174, 96, 0.2)' : '1px solid #f5c6cb'
                }}>
                    {statusMessage}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <div style={{
                        width: '150px',
                        height: '150px',
                        borderRadius: '50%',
                        border: '2px solid #ccc',
                        margin: '0 auto 15px auto',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f4f4f4'
                    }}>
                        {previewUrl ? (
                            <img src={previewUrl} alt="Profile Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <span style={{ color: '#aaa' }}>No Image</span>
                        )}
                    </div>
                    <label className="btn" style={{ cursor: 'pointer', display: 'inline-block' }}>
                        Choose New Picture
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                    </label>
                </div>

                <div className="form-group">
                    <label>Username (Name)</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Email (Unchangeable)</label>
                    <input
                        type="email"
                        value={user.email}
                        disabled
                        style={{ backgroundColor: '#e9ecef', cursor: 'not-allowed' }}
                    />
                </div>

                <button type="submit" className="btn" style={{ width: '100%' }} disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Profile Changes'}
                </button>
            </form>
        </div >
    );
};

export default Profile;
