const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected Successfully');
    } catch (err) {
        console.error('MongoDB Connection Error:', err.message);
        console.error('Current MONGO_URI starts with:', process.env.MONGO_URI ? process.env.MONGO_URI.substring(0, 20) + '...' : 'undefined');
        console.error('Please ensure your IP is whitelisted in MongoDB Atlas and the MONGO_URI is correct.');
    }
};

module.exports = connectDB;
