const SHGProvider = require('../models/SHGProvider');
const User = require('../models/User');

// Get all pending SHGs
exports.getPendingSHGs = async (req, res) => {
    try {
        const pendingSHGs = await SHGProvider.find({ shgStatus: 'pending' }).select('-password');
        res.json(pendingSHGs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Approve SHG
exports.approveSHG = async (req, res) => {
    try {
        const shg = await SHGProvider.findById(req.params.id);
        if (!shg) {
            return res.status(404).json({ msg: 'SHG Provider not found' });
        }

        shg.shgStatus = 'approved';
        await shg.save();

        res.json({ msg: 'SHG Provider approved' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Reject/Delete SHG
exports.rejectSHG = async (req, res) => {
    try {
        // Use deleteOne or findByIdAndDelete
        await SHGProvider.findByIdAndDelete(req.params.id);
        res.json({ msg: 'SHG Provider rejected and removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Start or Seeding Admin (One time setup usually, or just register via code)
// We might need a route to create the first admin or usually it's manually seeded.
// For now, I'll add a 'createAdmin' (public but secret or just standard register for simplicity in dev)
// Or better, just use a script. I'll rely on the User to register as admin manually via Postman or I can provide a seeder.
