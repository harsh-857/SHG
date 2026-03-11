const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Appointment = require('./models/Appointment');
const connectDB = require('./config/db');

dotenv.config();

async function debugAppointment() {
    await connectDB();

    const pendingAppointments = await Appointment.find({ status: 'pending' });
    console.log("Found", pendingAppointments.length, "pending appointments.");

    if (pendingAppointments.length > 0) {
        const app = pendingAppointments[0];
        console.log("Sample Pending Appointment:", app);
        console.log("Appointment ID:", app._id);
        console.log("Appointment Provider ID:", app.provider);
        console.log("To string Provider ID:", app.provider.toString());
    }

    process.exit(0);
}

debugAppointment().catch(console.error);
