// SASTRA-campus-game/server/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    // Stores the '12XXXXXXX' part of the email.
    rollNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    points: {
        type: Number,
        default: 0,
    },
    // Optional: for tracking which clubs the user joined
    clubs: {
        type: [String],
        default: [],
    },
    // For the login streak trophy system
    lastLogin: {
        type: Date,
        default: Date.now,
    },
    loginStreak: {
        type: Number,
        default: 0,
    },
    trophy: {
        type: String, // 'bronze', 'silver', 'gold'
        default: 'none',
    },
    // For the "Top Contributor" batch logic (manual assignment or based on a metric)
    isTopContributor: {
        type: Boolean,
        default: false,
    },
    // For displaying batches/titles on the frontend
    batches: {
        type: [String],
        default: [],
    }
});

module.exports = mongoose.model('User', UserSchema);