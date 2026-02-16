const axios = require('axios');

const testLogin = async () => {
    try {
        console.log('Attempting login to http://localhost:5001/api/auth/login...');
        const res = await axios.post('http://localhost:5001/api/auth/login', {
            email: 'admin@gmail.com',
            password: 'admin123'
        });
        console.log('Login SUCCESS!');
        console.log('Token:', res.data.token);
        console.log('Role:', res.data.user.role);
    } catch (err) {
        console.error('Login FAILED:');
        if (err.response) {
            console.error('Status:', err.response.status);
            console.error('Data:', err.response.data);
        } else {
            console.error(err.message);
        }
    }
};

testLogin();
