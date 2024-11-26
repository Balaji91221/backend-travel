// Import dependencies
const express = require('express');
const { User } = require('../models/user');
const { TravelPlan } = require('../models/travelPlan');
const authMiddleware = require('../middleware/auth');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Multer configuration for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png/;
        const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = fileTypes.test(file.mimetype);
        if (extName && mimeType) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed (jpeg, jpg, png).'));
        }
    }
});

// Add Travel Plan (Admin Only)
router.post('/travel-plans', authMiddleware(['Admin']), upload.single('image'), async (req, res) => {
    const { title, description, itinerary, accommodation, activities } = req.body;

    try {
        const newTravelPlan = new TravelPlan({
            image: req.file ? req.file.path : null,
            title,
            description,
            itinerary,
            accommodation,
            activities
        });
        await newTravelPlan.save();
        res.status(201).json({ message: 'Travel plan created successfully.', travelPlan: newTravelPlan });
    } catch (error) {
        res.status(500).json({ message: 'Error creating travel plan.', error });
    }
});

// Delete Travel Plan (Admin Only)
router.delete('/travel-plans/:id', authMiddleware(['Admin']), async (req, res) => {
    const { id } = req.params;

    try {
        const deletedPlan = await TravelPlan.findByIdAndDelete(id);
        if (!deletedPlan) {
            return res.status(404).json({ message: 'Travel plan not found.' });
        }

        res.status(200).json({ message: 'Travel plan deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting travel plan.', error });
    }
});

module.exports = router;
