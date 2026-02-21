import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const RegisterConsumer = () => {
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        village: '',
        block: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const { name, email, password, village, block } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/register-user', formData);
            login(res.data.token, res.data.user);
            navigate('/services');
        } catch (err) {
            console.error('Registration error details:', err.response?.data);
            const rawError = err.response?.data;
            let errorMsg = 'Registration failed';

            if (rawError) {
                if (typeof rawError === 'string') errorMsg = rawError;
                else if (rawError.msg) errorMsg = rawError.msg;
                else if (rawError.errors && rawError.errors[0]) errorMsg = rawError.errors[0].msg;
                else errorMsg = JSON.stringify(rawError);
            } else if (err.message) {
                errorMsg = err.message;
            }

            setError(errorMsg);
        }
    };

    return (
        <div className='card' style={{ maxWidth: '500px', margin: '20px auto' }}>
            <h2>Consumer Registration</h2>
            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
            <form onSubmit={onSubmit}>
                <div className='form-group'>
                    <label>Full Name</label>
                    <input type='text' name='name' value={name} onChange={onChange} required />
                </div>
                <div className='form-group'>
                    <label>Email Address</label>
                    <input type='email' name='email' value={email} onChange={onChange} required />
                </div>
                <div className='form-group'>
                    <label>Password</label>
                    <input type='password' name='password' value={password} onChange={onChange} required />
                </div>
                <div className='form-group'>
                    <label>Village Name</label>
                    <input type='text' name='village' value={village} onChange={onChange} required />
                </div>
                <div className='form-group'>
                    <label>Block</label>
                    <input type='text' name='block' value={block} onChange={onChange} required />
                </div>
                <button type='submit' className='btn' style={{ width: '100%' }}>Register</button>
            </form>
        </div>
    );
};

export default RegisterConsumer;
