const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Message = require('../models/Message');

// @route   GET api/chat/history/:userId
// @desc    Get chat history with valid user
// @access  Private
router.get('/history/:otherId', auth, async (req, res) => {
    try {
        const currentUserId = req.user.id;
        const otherUserId = req.params.otherId;

        const messages = await Message.find({
            $or: [
                { sender: currentUserId, receiver: otherUserId },
                { sender: otherUserId, receiver: currentUserId }
            ]
        }).sort({ timestamp: 1 });

        res.json(messages);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/chat/conversations
// @desc    Get list of conversations with unread counts
// @access  Private
router.get('/conversations', auth, async (req, res) => {
    try {
        const currentUserId = req.user.id;

        // Find all messages where currentUser is sender or receiver
        const messages = await Message.find({
            $or: [
                { sender: currentUserId },
                { receiver: currentUserId }
            ]
        }).sort({ timestamp: -1 });

        // Group by the other user
        const conversations = {};

        messages.forEach(msg => {
            const isSender = msg.sender.toString() === currentUserId;
            const otherUserId = isSender ? msg.receiver.toString() : msg.sender.toString();
            const otherUserModel = isSender ? msg.receiverModel : msg.senderModel;

            if (!conversations[otherUserId]) {
                conversations[otherUserId] = {
                    otherUserId,
                    otherUserModel,
                    lastMessage: msg,
                    unreadCount: 0
                };
            }

            // Increment unread count if the current user is the receiver and the message is not read
            if (!isSender && !msg.isRead) {
                conversations[otherUserId].unreadCount += 1;
            }
        });

        // We can't easily populate a dynamic ref across different collections in a single query reliably here
        // so we'll just return the grouped data. The frontend can fetch user details if needed, 
        // or we can populate them here if we query User/SHGProvider collections.
        // Let's query the names to make it easier for the frontend.
        const mongoose = require('mongoose');
        const User = mongoose.model('User');
        const SHGProvider = mongoose.model('SHGProvider');

        const populatedConversations = [];
        for (const key in conversations) {
            const conv = conversations[key];
            let otherUserDetail = null;
            if (conv.otherUserModel === 'User') {
                otherUserDetail = await User.findById(conv.otherUserId).select('name role');
            } else if (conv.otherUserModel === 'SHGProvider') {
                otherUserDetail = await SHGProvider.findById(conv.otherUserId).select('name role');
            }

            if (otherUserDetail) {
                populatedConversations.push({
                    ...conv,
                    otherUserDetail
                });
            }
        }

        res.json(populatedConversations.sort((a, b) => b.lastMessage.timestamp - a.lastMessage.timestamp));
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/chat/mark-read/:otherId
// @desc    Mark all messages from another user as read
// @access  Private
router.put('/mark-read/:otherId', auth, async (req, res) => {
    try {
        const currentUserId = req.user.id;
        const otherUserId = req.params.otherId;

        await Message.updateMany(
            { sender: otherUserId, receiver: currentUserId, isRead: false },
            { $set: { isRead: true } }
        );

        res.json({ msg: 'Messages marked as read' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
