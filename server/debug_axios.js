const axios = require('axios');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Appointment = require('./models/Appointment');
const User = require('./models/User');
const connectDB = require('./config/db');
const jwt = require('jsonwebtoken');

dotenv.config();

async function debugRequest() {
    await connectDB();

    // Find a pending appointment
    const app = await Appointment.findOne({ status: 'pending' });
    if (!app) {
        console.log('No pending appointments to test.');
        process.exit();
    }

    // Create a mock token for the provider
    const payload = {
        user: {
            id: app.provider.toString(),
            role: 'shg'
        }
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    console.log("Found appointment:", app._id);
    console.log("Provider ID:", app.provider);

    try {
        const res = await axios.put(`http://localhost:5000/api/appointments/${app._id}/status`,
            { status: 'confirmed' },
            { headers: { 'x-auth-token': token } }
        );
        console.log("Success! Status:", res.status, res.data);
    } catch (err) {
        console.error("HTTP ERROR:", err.response?.status, err.response?.data);
    }
    process.exit();
}

debugRequest().catch(console.error);
