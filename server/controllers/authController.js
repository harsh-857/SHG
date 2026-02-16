const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const SHGProvider = require('../models/SHGProvider');
const Admin = require('../models/Admin');

// Register Consumer
exports.registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, village, block } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            name,
            email,
            password,
            village,
            block,
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id,
                role: 'consumer',
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: user.id, name: user.name, role: 'consumer' } });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Register SHG Provider
exports.registerSHG = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, village, block, serviceCategory } = req.body;

    try {
        let shg = await SHGProvider.findOne({ email });
        if (shg) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        shg = new SHGProvider({
            name,
            email,
            password,
            village,
            block,
            serviceCategory,
        });

        const salt = await bcrypt.genSalt(10);
        shg.password = await bcrypt.hash(password, salt);

        await shg.save();

        // SHG is pending by default, so maybe don't return token immediately or return it but frontend restricts access?
        // Requirement: "SHG females cannot access the platform without admin approval."
        // So we just return success message.
        res.json({ msg: 'Registration successful. Please wait for admin approval.' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Login User/SHG/Admin
exports.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        console.log('Login attempt for:', email);

        // Check User
        let user = await User.findOne({ email });
        let role = 'consumer';

        if (!user) {
            user = await SHGProvider.findOne({ email });
            role = 'shg';
        }

        if (!user) {
            user = await Admin.findOne({ email });
            role = 'admin';
        }

        if (!user) {
            console.log('User not found in any collection');
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        console.log('User found:', user.email, 'Role:', role);

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Password mismatch');
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // Check if SHG is approved
        if (role === 'shg' && user.shgStatus !== 'approved') {
            return res.status(403).json({ msg: 'Account not approved by admin yet' });
        }

        const payload = {
            user: {
                id: user.id,
                role: role,
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: user.id, name: user.name, role: role } });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
