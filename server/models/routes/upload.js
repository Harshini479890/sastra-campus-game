// SASTRA-campus-game/server/routes/upload.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { google } = require('googleapis');
const path = require('path');
const User = require('../models/User'); // <-- ADD THIS LINE
const jwt = require('jsonwebtoken'); // <-- ADD THIS LINE

// Setup multer for memory storage (for Google Drive upload)
const upload = multer({ storage: multer.memoryStorage() });

// --- Google Drive Setup (Using Service Account for Unauthenticated Upload) ---
const auth = new google.auth.GoogleAuth({
    credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/drive.file'],
});

const drive = google.drive({ version: 'v3', auth });

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
// -----------------------------------------------------------------------------

// @route   POST /api/upload/material
// @desc    Uploads a file to Google Drive and awards points (Requires Auth)
router.post('/material', authMiddleware, upload.single('studyFile'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ msg: 'No file uploaded' });
    }

    try {
        const fileMetadata = {
            'name': req.file.originalname,
            parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
        };

        const media = {
            mimeType: req.file.mimetype,
            body: req.file.buffer,
        };

        const driveResponse = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id',
        });

        const user = await User.findById(req.user.id);
        if (user) {
            user.points += 100;
            await user.save();
        }

        res.json({
            msg: 'File uploaded successfully and 100 points awarded!',
            fileId: driveResponse.data.id,
            newPoints: user.points
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'File upload failed or server error' });
    }
});

module.exports = router;