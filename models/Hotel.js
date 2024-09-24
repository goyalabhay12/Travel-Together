const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const roomSchema = new mongoose.Schema({
    roomType: {
        type: String,
        enum: ["Basic", "Deluxe", "Suite"],
        required: true,
    },
    roomPrice: {
        type: Number,
        required: true,
    },
    roomCapacity: {
        type: Number,
        required: true,
        min: 0,
        max: 5,
    },
    totalRooms: {
        type: Number,
        required: true,
    },
    roomsAvailable: {
        type: Number,
        required: true,
    },
    description: {
        type: String, // Added room description
    },
});

const hotelSchema = new mongoose.Schema({
    hotelID: {
        type: String,
        required: true,
        unique: true,
    },
    hotelName: {
        type: String,
        required: true,
        trim: true,
    },
    location: {
        city: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
    },
    images: [
        {
            type: String,
        },
    ],
    description: {
        type: String,
    },
    amenities: {
        type: [String], // Changed to array of strings
    },
    contact: {
        phone: {
            type: String,
        },
        email: {
            type: String,
        },
        website: {
            type: String,
        },
    },
    policies: {
        checkInTime: {
            type: String,
        },
        checkOutTime: {
            type: String,
        },
        cancellationPolicy: {
            type: String,
        },
        // Add more policies as needed
    },
    priceRange: [{
        type: Number,
        min: 0,
    }, {
        type: Number,
        min: 0,
    }],
    rooms: [roomSchema],
    reviews: [reviewSchema],
});

hotelSchema.methods.calculateRating = function () {
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
hotelSchema.pre('save', function (next) {
    this.calculateRating();
    next();
});

const Hotel = mongoose.model("Hotel", hotelSchema);

module.exports = Hotel;
