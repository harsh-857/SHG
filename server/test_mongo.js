const mongoose = require('mongoose');

const uri = "mongodb+srv://harshsharmavs000_db_user:kO9Qr9I6mGyOhqwx@user.bhv6e9x.mongodb.net/shg?appName=user";

async function testConnection() {
    try {
        console.log("Attempting to connect to MongoDB...");
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
        console.log("Connection successful!");
        process.exit(0);
    } catch (err) {
        console.error("Connection failed:", err.message);
        process.exit(1);
    }
}

testConnection();
