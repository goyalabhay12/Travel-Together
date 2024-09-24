const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const destinationSchema = new mongoose.Schema({
    destID: {
        type: String,
        required: true,
        unique: true
    },
    destinationName: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    activities: {
        type: [String]
    },
    bestFor: [{
        type: String
    }],
    transportOptions: {
        type: [String]
    },
    description: {
        type: String
    },
    images: [{
        type: String,
        required: true
    }],
    languages: {
        type: [String]
    },
    cuisine: {
        type: [String]
    },
    bestTime: {
        type: [String]
    },
    reviews: [reviewSchema], // Array of review objects
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0 // Default to 0 if no reviews yet
    }
});

// Define a method to calculate the destination's rating
destinationSchema.methods.calculateRating = function() {
    const totalReviews = this.reviews.length;
    if (totalReviews === 0) {
        this.rating = 0; // If there are no reviews, set rating to 0
    } else {
        const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
        const calculatedRating = totalRating / totalReviews;
        this.rating = Math.round(calculatedRating * 10) / 10; // Round to 1 digit after the decimal point
    }
};


// Define a pre-save hook to automatically recalculate the rating before saving
destinationSchema.pre('save', function(next) {
    this.calculateRating();
    next();
});

const Destination = mongoose.model('Destination', destinationSchema);

module.exports = Destination;
