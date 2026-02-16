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

module.exports = router;
