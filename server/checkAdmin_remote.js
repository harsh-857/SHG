const mongoose = require('mongoose');
const Admin = require('./models/Admin');

const atlasUri = "mongodb+srv://harshsharmavs000_db_user:kO9Qr9I6mGyOhqwx@user.bhv6e9x.mongodb.net/shg?appName=user";

const checkAdmin = async () => {
    try {
        console.log('Connecting to Atlas...');
        await mongoose.connect(atlasUri);
        const admin = await Admin.findOne({ email: 'admin@gmail.com' });
        if (admin) {
            console.log('Admin found in Atlas:', admin.email);
            console.log('Role:', admin.role);
        } else {
            console.log('Admin NOT found in Atlas');
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkAdmin();
