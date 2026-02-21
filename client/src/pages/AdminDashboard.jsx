import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
    const { user, loading: authLoading } = useAuth();
    const [pendingSHGs, setPendingSHGs] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [allSHGs, setAllSHGs] = useState([]);
    const [activeTab, setActiveTab] = useState('pending');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading) {
            if (!user || user.role !== 'admin') {
                navigate('/login');
            } else {
                fetchData();
            }
        }
    }, [user, authLoading, navigate, activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'pending') {
                const res = await api.get('/admin/pending-shg');
                setPendingSHGs(res.data);
            } else if (activeTab === 'users') {
                const res = await api.get('/admin/users');
                setAllUsers(res.data);
            } else if (activeTab === 'shgs') {
                const res = await api.get('/admin/shgs');
                setAllSHGs(res.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const approveSHG = async (id) => {
        try {
            await api.put(`/admin/approve-shg/${id}`);
            fetchData();
            alert('SHG Provider Approved');
        } catch (err) {
            console.error(err);
            alert('Error approving');
        }
    };

    const rejectSHG = async (id) => {
        if (!window.confirm('Are you sure you want to reject/delete this SHG?')) return;
        try {
            await api.delete(`/admin/reject-shg/${id}`);
            fetchData();
            alert('SHG Rejected');
        } catch (err) {
            console.error(err);
            alert('Error rejecting');
        }
    };

    const deleteUser = async (id) => {
        if (!window.confirm('Delete this user account?')) return;
        try {
            await api.delete(`/admin/user/${id}`);
            fetchData();
            alert('User Deleted');
        } catch (err) {
            console.error(err);
            alert('Error deleting');
        }
    };

    if (authLoading) return <p>Loading...</p>;

    return (
        <div>
            <h1>Admin Dashboard</h1>

            <div style={{ margin: '10px 0' }}>
                <button onClick={() => setActiveTab('pending')} style={{ marginRight: '10px' }}>Pending Approvals</button>
                <button onClick={() => setActiveTab('users')} style={{ marginRight: '10px' }}>Users</button>
                <button onClick={() => setActiveTab('shgs')}>SHG Providers</button>
            </div>

            {loading ? <p>Loading...</p> : (
                <div>
                    {activeTab === 'pending' && (
                        <>
                            <h2>Pending SHG Approvals</h2>
                            {pendingSHGs.length === 0 ? <p>No pending registrations.</p> : (
                                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                                    <thead>
                                        <tr style={{ background: '#eee', textAlign: 'left' }}>
                                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Name</th>
                                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Category</th>
                                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Location</th>
                                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pendingSHGs.map(shg => (
                                            <tr key={shg._id}>
                                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{shg.name} <br /> <small>{shg.email}</small></td>
                                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{shg.serviceCategory}</td>
                                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{shg.village}, {shg.block}</td>
                                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                                    <button onClick={() => approveSHG(shg._id)} style={{ marginRight: '5px', background: 'green', color: 'white' }}>Approve</button>
                                                    <button onClick={() => rejectSHG(shg._id)} style={{ background: 'red', color: 'white' }}>Reject</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </>
                    )}

                    {activeTab === 'users' && (
                        <>
                            <h2>Registered Consumers</h2>
                            {allUsers.length === 0 ? <p>No users found.</p> : (
                                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                                    <thead style={{ background: '#eee' }}>
                                        <tr>
                                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Name / Email</th>
                                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Location</th>
                                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allUsers.map(u => (
                                            <tr key={u._id}>
                                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{u.name} <br /> <small>{u.email}</small></td>
                                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{u.village}, {u.block}</td>
                                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                                    <button onClick={() => deleteUser(u._id)} style={{ background: 'red', color: 'white' }}>Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </>
                    )}

                    {activeTab === 'shgs' && (
                        <>
                            <h2>All SHG Providers</h2>
                            {allSHGs.length === 0 ? <p>No providers found.</p> : (
                                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                                    <thead style={{ background: '#eee' }}>
                                        <tr>
                                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Name</th>
                                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Status</th>
                                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allSHGs.map(s => (
                                            <tr key={s._id}>
                                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{s.name} <br /> <small>{s.email}</small></td>
                                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{s.shgStatus}</td>
                                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                                    <button onClick={() => rejectSHG(s._id)} style={{ background: 'red', color: 'white' }}>Remove</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
