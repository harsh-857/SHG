const axios = require('axios');

const testRemoteLogin = async () => {
    const urls = [
        'https://shg-6s8l.onrender.com/api/auth/login',
        'https://shg-six.vercel.app/api/auth/login'
    ];

    for (const url of urls) {
        try {
            console.log(`Testing login to ${url}...`);
            const res = await axios.post(url, {
                email: 'admin@gmail.com',
                password: 'admin123'
            });
            console.log(`SUCCESS for ${url}!`);
            console.log('Role:', res.data.user.role);
        } catch (err) {
            console.log(`FAILED for ${url}:`);
            if (err.response) {
                console.log('Status:', err.response.status);
                console.log('Data:', JSON.stringify(err.response.data));
            } else {
                console.log('Error:', err.message);
            }
        }
        console.log('---');
    }
};

testRemoteLogin();
