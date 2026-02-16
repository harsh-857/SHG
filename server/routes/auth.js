const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const User = require('../models/User'); // For loading user

// @route   POST api/auth/register-user
// @desc    Register user (Consumer)
// @access  Public
router.post(
    '/register-user',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
        check('village', 'Village is required').not().isEmpty(),
        check('block', 'Block is required').not().isEmpty(),
    ],
    authController.registerUser
);

// @route   POST api/auth/register-shg
// @desc    Register SHG Provider
// @access  Public
router.post(
    '/register-shg',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
        check('village', 'Village is required').not().isEmpty(),
        check('block', 'Block is required').not().isEmpty(),
        check('serviceCategory', 'Service Category is required').not().isEmpty(),
    ],
    authController.registerSHG
);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
    '/login',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists(),
    ],
    authController.login
);

// @route   GET api/auth/user
// @desc    Get logged in user
// @access  Private
router.get('/user', auth, async (req, res) => {
    try {
        // Need to check which collection based on role in token, or just check all (inefficient) or store role in token.
        // We stored role in token.
        let user;
        if (req.user.role === 'consumer') {
            user = await User.findById(req.user.id).select('-password');
        } else if (req.user.role === 'shg') {
            // Need to require SHGProvider model here or in controller
            const SHGProvider = require('../models/SHGProvider');
            user = await SHGProvider.findById(req.user.id).select('-password');
        } else if (req.user.role === 'admin') {
            const Admin = require('../models/Admin');
            user = await Admin.findById(req.user.id).select('-password');
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
