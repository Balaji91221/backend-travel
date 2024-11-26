// Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');

// Load environment variables
dotenv.config();

// Create an Express app
const app = express();

// Middleware
app.use(express.json());  // Parse JSON request bodies
app.use(cors());           // Enable CORS for all origins

// Routes
app.use('/api/auth', authRoutes);    // Authentication routes (signup, login, OTP)
app.use('/api/admin', adminRoutes);  // Admin routes (add, delete travel plans)
app.use('/api/user', userRoutes);    // User routes (save, fetch saved plans)

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.log('Error connecting to MongoDB:', error));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
