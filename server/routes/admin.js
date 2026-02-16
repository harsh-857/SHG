const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied. Admins only.' });
    }
    next();
};

// @route   GET api/admin/pending-shg
// @desc    Get all pending SHGs
// @access  Private (Admin only)
router.get('/pending-shg', auth, isAdmin, adminController.getPendingSHGs);

// @route   PUT api/admin/approve-shg/:id
// @desc    Approve SHG
// @access  Private (Admin only)
router.put('/approve-shg/:id', auth, isAdmin, adminController.approveSHG);

// @route   DELETE api/admin/reject-shg/:id
// @desc    Reject/Delete SHG
// @access  Private (Admin only)
router.delete('/reject-shg/:id', auth, isAdmin, adminController.rejectSHG);

module.exports = router;
