const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const SHGProvider = require('../models/SHGProvider');

// @route   GET api/services/search
// @desc    Search SHGs by category (and location priority logic handled here or frontend? Backend is better)
// @access  Private (Consumer/All)
router.get('/search', async (req, res) => {
    // Query params: category, village, block (Consumer's location)
    const { category, village, block } = req.query;

    if (!category) {
        return res.status(400).json({ msg: 'Category is required' });
    }

    try {
        // Find all approved providers in the category
        let providers = await SHGProvider.find({
            serviceCategory: category,
            shgStatus: 'approved'
        }).select('-password');

        // Sort based on location:
        // 1. Same Village
        // 2. Same Block
        // 3. Others
        // We can do this in memory since dataset is likely small for a district, or use complex aggregation. In-memory is easier for MERN starter.

        const consumerVillage = village ? village.toLowerCase() : '';
        const consumerBlock = block ? block.toLowerCase() : '';

        providers.sort((a, b) => {
            const aVillage = a.village.toLowerCase() === consumerVillage;
            const bVillage = b.village.toLowerCase() === consumerVillage;
            const aBlock = a.block.toLowerCase() === consumerBlock;
            const bBlock = b.block.toLowerCase() === consumerBlock;

            if (aVillage && !bVillage) return -1;
            if (!aVillage && bVillage) return 1;
            if (aBlock && !bBlock) return -1;
            if (!aBlock && bBlock) return 1;
            return 0;
        });

        res.json(providers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
