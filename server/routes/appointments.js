const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const SHGProvider = require('../models/SHGProvider');

// @route   GET api/appointments/availability/:providerId/:date
// @desc    Get booked slots for a provider on a specific date
// @access  Public (or Private)
router.get('/availability/:providerId/:date', async (req, res) => {
    try {
        const { providerId, date } = req.params;
        const appointments = await Appointment.find({
            provider: providerId,
            date: date,
            status: { $ne: 'cancelled' }
        }).select('timeSlot');

        const bookedSlots = appointments.map(app => app.timeSlot);
        res.json(bookedSlots);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/appointments/book
// @desc    Book a new appointment
// @access  Private
router.post('/book', auth, async (req, res) => {
    const { providerId, date, timeSlot } = req.body;

    try {
        // Check if slot is already taken
        const existingAppointment = await Appointment.findOne({
            provider: providerId,
            date: date,
            timeSlot: timeSlot,
            status: { $ne: 'cancelled' }
        });

        if (existingAppointment) {
            return res.status(400).json({ msg: 'This time slot is already booked. Please select another time.' });
        }

        const newAppointment = new Appointment({
            provider: providerId,
            consumer: req.user.id,
            date,
            timeSlot
        });

        const appointment = await newAppointment.save();
        res.json(appointment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/appointments/my-appointments
// @desc    Get appointments for the logged-in user
// @access  Private
router.get('/my-appointments', auth, async (req, res) => {
    try {
        // Find appointments where the user is either the consumer or the provider
        // Note: Middleware 'auth' sets req.user.id. We need to check if that ID matches consumer or provider.
        // However, User model and SHGProvider model are separate collections.
        // If the logged in user is a 'shg' (provider), they might look for provider field.
        // If 'user' (consumer), consumer field.

        // Let's first check the user's role from their token/DB info ideally, but here we can just query both.
        // Or better, let's rely on the frontend to know current user type or just fetch all where ID matches.

        const appointments = await Appointment.find({
            $or: [{ consumer: req.user.id }, { provider: req.user.id }]
        })
            .populate('provider', 'name village block serviceCategory')
            .populate('consumer', 'name email')
            .sort({ date: 1, timeSlot: 1 });

        res.json(appointments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
