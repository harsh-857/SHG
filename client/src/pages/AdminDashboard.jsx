import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [pendingSHGs, setPendingSHGs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Verify admin role
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.role !== 'admin') {
            navigate('/login');
        }
        fetchPending();
    }, [navigate]);

    const fetchPending = async () => {
        try {
            const res = await api.get('/admin/pending-shg', {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            setPendingSHGs(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const approveSHG = async (id) => {
        try {
            await api.put(`/admin/approve-shg/${id}`, {}, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            fetchPending();
            alert('SHG Approved');
        } catch (err) {
            console.error(err);
            alert('Error approving');
        }
    };

    const rejectSHG = async (id) => {
        if (!window.confirm('Are you sure you want to reject/delete this SHG?')) return;
        try {
            await api.delete(`/admin/reject-shg/${id}`, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            fetchPending();
            alert('SHG Rejected');
        } catch (err) {
            console.error(err);
            alert('Error rejecting');
        }
    };

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <h2>Pending SHG Approvals</h2>

            {pendingSHGs.length === 0 ? <p>No pending registrations.</p> : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                    <thead>
                        <tr style={{ background: '#eee', textAlign: 'left' }}>
                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Name</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Category</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Village/Block</th>
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
                                    <button className="btn" onClick={() => approveSHG(shg._id)} style={{ marginRight: '5px', background: 'green' }}>Approve</button>
                                    <button className="btn" onClick={() => rejectSHG(shg._id)} style={{ background: 'red' }}>Reject</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminDashboard;
