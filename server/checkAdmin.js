const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');
const connectDB = require('./config/db');

dotenv.config();

const checkAdmin = async () => {
    await connectDB();

    try {
        const admin = await Admin.findOne({ email: 'admin@gmail.com' });
        if (!admin) {
            console.log('Admin user NOT FOUND in database.');
        } else {
            console.log('Admin user FOUND.');
            console.log('Stored Hash:', admin.password);

            const isMatch = await bcrypt.compare('admin123', admin.password);
            console.log('Password "admin123" matches hash:', isMatch);
        }
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkAdmin();
