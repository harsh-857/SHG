import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const { login, user, loading } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Redirect already authenticated users
    useEffect(() => {
        if (!loading && user) {
            if (user.role === 'admin') navigate('/admin', { replace: true });
            else if (user.role === 'shg') navigate('/shg-dashboard', { replace: true });
            else navigate('/services', { replace: true });
        }
    }, [user, loading, navigate]);

    const { email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', { email, password });
            login(res.data.token, res.data.user);

            // Redirect based on role with replace history
            if (res.data.user.role === 'admin') {
                navigate('/admin', { replace: true });
            } else if (res.data.user.role === 'shg') {
                navigate('/shg-dashboard', { replace: true });
            } else {
                navigate('/services', { replace: true });
            }
        } catch (err) {
            console.error('Login error details:', err.response?.data);
            const errorMsg = err.response?.data?.msg || (typeof err.response?.data === 'string' ? err.response.data : 'Login failed');
            setError(errorMsg);
        }
    };

    return (
        <div className='card' style={{ maxWidth: '400px', margin: '20px auto' }}>
            <h2>Login</h2>
            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
            <form onSubmit={onSubmit}>
                <div className='form-group'>
                    <label>Email Address</label>
                    <input
                        type='email'
                        name='email'
                        value={email}
                        onChange={onChange}
                        required
                    />
                </div>
                <div className='form-group'>
                    <label>Password</label>
                    <input
                        type='password'
                        name='password'
                        value={password}
                        onChange={onChange}
                        required
                    />
                </div>
                <button type='submit' className='btn' style={{ width: '100%' }}>Login</button>
            </form>
        </div>
    );
};

export default Login;
