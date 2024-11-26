// Import dependencies
const express = require('express');
const { User } = require('../models/user');
const { TravelPlan } = require('../models/travelPlan');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Save a Travel Plan to User Profile
router.post('/save-plan/:id', authMiddleware(['User']), async (req, res) => {
    const userId = req.user.id;
    const travelPlanId = req.params.id;

    try {
        // Check if travel plan exists
        const travelPlan = await TravelPlan.findById(travelPlanId);
        if (!travelPlan) {
            return res.status(404).json({ message: 'Travel plan not found.' });
        }

        // Add travel plan to user's saved plans
        const user = await User.findById(userId);
        if (user.savedPlans.includes(travelPlanId)) {
            return res.status(400).json({ message: 'Travel plan already saved.' });
        }

        user.savedPlans.push(travelPlanId);
        await user.save();

        res.status(200).json({ message: 'Travel plan saved successfully.', savedPlans: user.savedPlans });
    } catch (error) {
        res.status(500).json({ message: 'Error saving travel plan.', error });
    }
});

// Get User's Saved Plans
router.get('/saved-plans', authMiddleware(['User']), async (req, res) => {
    const userId = req.user.id;

    try {
        // Fetch user with populated saved plans
        const user = await User.findById(userId).populate('savedPlans');
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({ message: 'Saved plans fetched successfully.', savedPlans: user.savedPlans });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching saved plans.', error });
    }
});

module.exports = router;
