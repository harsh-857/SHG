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

// @route   GET api/admin/users
// @desc    Get all users
// @access  Private (Admin only)
router.get('/users', auth, isAdmin, adminController.getAllUsers);

// @route   GET api/admin/shgs
// @desc    Get all SHGs
// @access  Private (Admin only)
router.get('/shgs', auth, isAdmin, adminController.getAllSHGs);

// @route   DELETE api/admin/user/:id
// @desc    Delete a user
// @access  Private (Admin only)
router.delete('/user/:id', auth, isAdmin, adminController.deleteUser);

module.exports = router;
