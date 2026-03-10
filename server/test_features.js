const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Message = require('./models/Message');
const User = require('./models/User');
const SHGProvider = require('./models/SHGProvider');
const Appointment = require('./models/Appointment');
const connectDB = require('./config/db');

dotenv.config();

async function runTest() {
    await connectDB();

    // 1. Find a user and an SHG provider
    const user = await User.findOne();
    const shg = await SHGProvider.findOne();

    if (!user || !shg) {
        console.log("Need at least one user and one SHG provider in the DB.");
        process.exit(1);
    }

    console.log(`Found User: ${user.name}`);
    console.log(`Found SHG: ${shg.name}`);

    // 2. Create some unread messages from User to SHG
    await Message.create({
        sender: user._id,
        senderModel: 'User',
        receiver: shg._id,
        receiverModel: 'SHGProvider',
        content: `Hello ${shg.name}, I need help!`,
        isRead: false
    });

    console.log("Created an unread message from User to SHG.");

    // 3. Test the aggregation logic that the router uses
    const messages = await Message.find({
        $or: [
            { sender: shg._id },
            { receiver: shg._id }
        ]
    }).sort({ timestamp: -1 });

    let unreadCount = 0;
    messages.forEach(msg => {
        if (msg.receiver.toString() === shg._id.toString() && !msg.isRead) {
            unreadCount++;
        }
    });

    console.log(`SHG has ${unreadCount} unread messages in total.`);

    if (unreadCount > 0) {
        console.log("Test Passed: Unread message logic works.");
    } else {
        console.log("Test Failed: Unread message not detected.");
    }

    // 4. Test Appointment Logic
    const existingAppt = await Appointment.findOne({ provider: shg._id, consumer: user._id });
    if (!existingAppt) {
        await Appointment.create({
            provider: shg._id,
            consumer: user._id,
            date: '2026-03-11',
            timeSlot: '10:00 AM'
        });
        console.log("Created a test appointment.");
    } else {
        console.log("Test appointment already exists.");
    }

    process.exit(0);
}

runTest().catch(console.error);
