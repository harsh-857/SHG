import React from 'react';
import { Link } from 'react-router-dom';

const RegisterSelect = () => {
    return (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <h2>Register</h2>
            <p>Join the platform. Choose your registration type.</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px' }}>
                <Link to="/register-consumer" className="btn" style={{ minWidth: '200px' }}>
                    Register as User
                </Link>
                <Link to="/register-shg" className="btn" style={{ minWidth: '200px', backgroundColor: '#555' }}>
                    Register as SHG Member
                </Link>
            </div>
        </div>
    );
};

export default RegisterSelect;
