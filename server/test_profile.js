const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

async function runTest() {
    await connectDB();

    const user = await User.findOne();
    if (!user) {
        console.log("No user found.");
        process.exit(1);
    }

    // Set a dummy profile pic
    user.profilePicture = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
    user.name = 'Test User Updated';
    await user.save();

    const updatedUser = await User.findById(user._id);
    if (updatedUser.profilePicture.startsWith('data:image') && updatedUser.name === 'Test User Updated') {
        console.log("Profile Update Backend Test Passed!");
    } else {
        console.log("Profile Update Backend Test Failed!");
    }

    process.exit(0);
}

runTest().catch(console.error);
