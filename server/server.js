// SASTRA-campus-game/server/server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); // Essential for connecting frontend/backend

// Load environment variables from .env file
dotenv.config();

const app = express();

// --- Connect Database ---
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

connectDB();

// --- Middleware ---
app.use(cors()); // Allow cross-origin requests from your frontend
app.use(express.json({ extended: false })); // Allows us to get data in req.body

app.get('/', (req, res) => res.send('API Running'));

// --- Define Routes ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/upload', require('./routes/upload'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
