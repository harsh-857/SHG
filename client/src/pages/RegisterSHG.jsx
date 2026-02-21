import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const RegisterSHG = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        village: '',
        block: '',
        serviceCategory: 'Housekeeping Services'
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(''); // For pending approval message

    const { name, email, password, village, block, serviceCategory } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/register-shg', formData);
            setSuccess(res.data.msg);
            setError('');
        } catch (err) {
            console.error('Registration SHG error details:', err.response?.data);
            const errorMsg = err.response?.data?.msg || err.response?.data?.errors?.[0]?.msg || (typeof err.response?.data === 'string' ? err.response.data : 'Registration failed');
            setError(errorMsg);
        }
    };

    if (success) {
        return (
            <div className='card' style={{ maxWidth: '500px', margin: '20px auto', textAlign: 'center' }}>
                <h2 style={{ color: 'green' }}>Registration Successful</h2>
                <p>{success}</p>
                <p>You will be able to login once the Admin approves your request.</p>
            </div>
        )
    }

    return (
        <div className='card' style={{ maxWidth: '500px', margin: '20px auto' }}>
            <h2>SHG Provider Registration</h2>
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
                <div className='form-group'>
                    <label>Service Category</label>
                    <select name='serviceCategory' value={serviceCategory} onChange={onChange}>
                        <option value="Housekeeping Services">Housekeeping Services</option>
                        <option value="Beauty Parlour Course / Services">Beauty Parlour Course / Services</option>
                        <option value="Tailoring Services">Tailoring Services</option>
                        <option value="Papad and Pickle Making">Papad and Pickle Making</option>
                    </select>
                </div>
                <button type='submit' className='btn' style={{ width: '100%' }}>Register as SHG</button>
            </form>
        </div>
    );
};

export default RegisterSHG;
