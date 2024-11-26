// Import dependencies
const mongoose = require('mongoose');

// Travel Plan Schema
const travelPlanSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    itinerary: {
        type: String,
        required: true
    },
    accommodation: {
        type: String,
        required: true
    },
    activities: {
        type: String,
        required: true
    }
}, { timestamps: true });

const TravelPlan = mongoose.model('TravelPlan', travelPlanSchema);

module.exports = { TravelPlan };
