const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');

const atlasUri = "mongodb+srv://harshsharmavs000_db_user:kO9Qr9I6mGyOhqwx@user.bhv6e9x.mongodb.net/shg?appName=user";

const seedRemoteAdmin = async () => {
    try {
        console.log('Connecting to Atlas to seed admin...');
        await mongoose.connect(atlasUri);

        let admin = await Admin.findOne({ email: 'admin@gmail.com' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        if (admin) {
            console.log('Admin already exists in Atlas. Updating password...');
            admin.password = hashedPassword;
            await admin.save();
        } else {
            console.log('Creating new Admin in Atlas...');
            admin = new Admin({
                name: 'Super Admin',
                email: 'admin@gmail.com',
                password: hashedPassword,
                role: 'admin'
            });
            await admin.save();
        }

        console.log('Remote Admin credentials synced.');
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
};

seedRemoteAdmin();
