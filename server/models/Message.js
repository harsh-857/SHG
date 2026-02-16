const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Can be User or SHGProvider, but ID validation might be tricky if collections differ. 
        // Usually simpler to have a uniform 'User' model or store collection name.
        // For this MVP, we'll store just the ID and assume checking both collections or unify references if possible. 
        // Actually, since User and SHGProvider are separate, 'ref' validation might fail if strict.
        // Let's store just ObjectId and handle lookup manually or use refPath if needed.
        required: true
    },
    senderModel: {
        type: String,
        required: true,
        enum: ['User', 'SHGProvider']
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        required: true // Can be User or SHGProvider
    },
    receiverModel: {
        type: String,
        required: true,
        enum: ['User', 'SHGProvider']
    },
    content: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Message', MessageSchema);
