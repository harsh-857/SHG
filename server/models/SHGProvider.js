const mongoose = require('mongoose');

const SHGProviderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    village: {
        type: String,
        required: true,
    },
    block: {
        type: String,
        required: true,
    },
    serviceCategory: {
        type: String,
        required: true,
        enum: ['Housekeeping Services', 'Beauty Parlour Course / Services', 'Tailoring Services', 'Papad and Pickle Making'],
    },
    shgStatus: {
        type: String,
        default: 'pending',
        enum: ['pending', 'approved', 'rejected'],
    },
    role: {
        type: String,
        default: 'shg',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Add indexes for location-based filtering
SHGProviderSchema.index({ village: 1 });
SHGProviderSchema.index({ block: 1 });
SHGProviderSchema.index({ serviceCategory: 1 });

module.exports = mongoose.model('SHGProvider', SHGProviderSchema);
