// SASTRA-campus-game/server/routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- Helpers ---
const EMAIL_REGEX = /^(\d{9})@sastra\.ac\.in$/; // Matches 9 digits followed by @sastra.ac.in

const validatePassword = (password) => {
    // Condition: Password must be at least 8 characters long
    return password.length >= 8;
};

// --- Middleware for Authentication ---
const authMiddleware = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (e) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
// ----------------------------------------

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    // 1. Validate Email and Extract Roll Number
    const match = email.match(EMAIL_REGEX);
    if (!match) {
        return res.status(400).json({ msg: 'Invalid SASTRA email format.' });
    }
    const rollNumber = match[1]; // Extracts the '12XXXXXXX' part

    // 2. Validate Password
    if (!validatePassword(password)) {
        return res.status(400).json({ msg: 'Password must be at least 8 characters long.' });
    }

    try {
        let user = await User.findOne({ rollNumber });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            rollNumber,
            password, // Will be hashed below
            points: 0, // Initial points
        });

        // 3. Hash Password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        // 4. Create and send JWT
        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5d' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Validate and extract rollNumber (same logic as register)
    const match = email.match(EMAIL_REGEX);
    if (!match) {
        return res.status(400).json({ msg: 'Invalid credentials' });
    }
    const rollNumber = match[1];

    try {
        let user = await User.findOne({ rollNumber });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // --- Login Streak Logic (Gamification) ---
        const now = new Date();
        const oneDay = 24 * 60 * 60 * 1000;
        const lastLoginDay = new Date(user.lastLogin).setHours(0, 0, 0, 0);
        const today = now.setHours(0, 0, 0, 0);

        if (today > lastLoginDay) {
            const daysDifference = (today - lastLoginDay) / oneDay;

            if (daysDifference === 1) {
                user.loginStreak += 1; // Consecutive day login
            } else {
                user.loginStreak = 1; // Streak reset
            }

            // Update Trophy
            if (user.loginStreak >= 7) {
                user.trophy = 'gold'; // 7+ days
            } else if (user.loginStreak >= 3) {
                user.trophy = 'silver'; // 3-6 days
            } else {
                user.trophy = 'bronze'; // 1-2 days
            }

            user.lastLogin = now;
            await user.save();
        }
        // ----------------------------------------

        // Create and send JWT
        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5d' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { rollNumber: user.rollNumber, points: user.points, trophy: user.trophy } });
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


// @route   PUT /api/auth/add-points
// @desc    Generic endpoint to add points for any activity (Requires Auth)
router.put('/add-points', authMiddleware, async (req, res) => {
    const { activity } = req.body;
    let pointsToAdd = 0;
    let batchToAdd = null;

    // Gamification Point System Logic
    switch (activity) {
        case 'study_material_upload':
            pointsToAdd = 100;
            break;
        case 'joining_club':
            pointsToAdd = 200;
            batchToAdd = 'Club Member';
            break;
        case 'participation':
            pointsToAdd = 50;
            break;
        case 'volunteering':
            pointsToAdd = 100;
            break;
        case 'top_contributor':
            pointsToAdd = 200;
            batchToAdd = 'Top Contributor';
            break;
        default:
            return res.status(400).json({ msg: 'Invalid activity type' });
    }

    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        user.points += pointsToAdd;

        if (batchToAdd && !user.batches.includes(batchToAdd)) {
            user.batches.push(batchToAdd);
        }

        await user.save();
        res.json({ msg: `${pointsToAdd} points added for ${activity}. New total: ${user.points}`, points: user.points, batches: user.batches });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


// @route   GET /api/auth/ranking
// @desc    Get top 10 users for ranking
router.get('/ranking', async (req, res) => {
    try {
        const ranking = await User.find()
            .sort({ points: -1 }) // Sort by points descending
            .limit(10) // Limit to top 10
            .select('rollNumber points batches trophy'); // Select fields to display

        res.json(ranking);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
