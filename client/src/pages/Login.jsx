import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const { email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            // Redirect based on role
            if (res.data.user.role === 'admin') {
                navigate('/admin');
            } else if (res.data.user.role === 'shg') {
                navigate('/shg-dashboard');
            } else {
                navigate('/services'); // or consumer dashboard
            }
        } catch (err) {
            setError(err.response?.data?.msg || 'Login failed');
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
