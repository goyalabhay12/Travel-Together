const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookingSchema = new Schema({
    booking_id: { 
        type: String,  // Adjust the type if needed (e.g., String for alphanumeric IDs)
        required: true,
        unique: true   // Ensure each booking ID is unique
    },
    user_id: {
        type: Schema.Types.ObjectId, // Reference to User model
        ref: 'User',
        required: true
    },
    hotel_id: {
        type: Schema.Types.ObjectId, // Reference to Hotel model
        ref: 'Hotel', 
        required: true
    },
    check_in_date: {
        type: Date,
        required: true
    },
    check_out_date: {
        type: Date,
        required: true
    },
    number_of_guests: {
        type: Number,
        required: true
    },
    room_type: {
        type: String,
        required: true
    },
    total_price: {
        type: Number,
        required: true
    },
    booking_status: {
        type: String,
        enum: ['confirmed', 'pending', 'canceled'], // Limit to specific values
        default: 'pending'
    },
    payment_status: {
        type: String,
        enum: ['paid', 'pending', 'failed'], // Payment status options
        default: 'pending'
    }
});

const Booking = mongoose.model('Booking', BookingSchema);

module.exports = Booking;
