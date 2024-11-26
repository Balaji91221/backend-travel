// Import dependencies
const express = require('express');
const { User, sendOTP } = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Temporary store for OTPs (in production, use a database or cache)
const otpStore = {};

// Signup Route
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered.' });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000);
        otpStore[email] = otp; // Save OTP to temporary store

        // Send OTP to user's email
        await sendOTP(email, otp);

        res.status(200).json({ message: 'OTP sent to email.' });
    } catch (error) {
        res.status(500).json({ message: 'Error during signup.', error });
    }
});

// OTP Verification and User Creation
router.post('/verify-otp', async (req, res) => {
    const { name, email, password, otp } = req.body;

    try {
        // Check if OTP is valid
        if (otpStore[email] !== parseInt(otp)) {
            return res.status(400).json({ message: 'Invalid OTP.' });
        }

        // Delete OTP after verification
        delete otpStore[email];



        // Create new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User created successfully. Please log in.' });
    } catch (error) {
        res.status(500).json({ message: 'Error during OTP verification.', error });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Compare passwords
        const isPasswordValid = await user.comparePassword(password);
        console.log('Password valid:', isPasswordValid); // Debugging
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Generate JWT
        const token = user.generateAuthToken();
        console.log('Generated Token:', token); // Debugging

        res.status(200).json({ message: 'Login successful.', token });
    } catch (error) {
        console.error('Error during login:', error); // Debugging
        res.status(500).json({ message: 'Error during login.', error });
    }
});

module.exports = router;
