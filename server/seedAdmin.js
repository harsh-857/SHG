const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');
const connectDB = require('./config/db');

dotenv.config();

const seedAdmin = async () => {
    await connectDB();

    try {
        let admin = await Admin.findOne({ email: 'admin@gmail.com' });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        if (admin) {
            console.log('Admin exists. Updating password...');
            admin.password = hashedPassword;
            await admin.save();
        } else {
            console.log('Creating new Admin...');
            admin = new Admin({
                name: 'Super Admin',
                email: 'admin@gmail.com',
                password: hashedPassword,
                role: 'admin'
            });
            await admin.save();
        }

        console.log('Admin credentials synced.');
        console.log('Email: admin@gmail.com');
        console.log('Password: admin123');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedAdmin();
