const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected Successfully');
    } catch (err) {
        console.error('MongoDB Connection Error:', err.message);
        console.error('Please ensure your IP is whitelisted in MongoDB Atlas and the MONGO_URI is correct.');
    }
};

module.exports = connectDB;
