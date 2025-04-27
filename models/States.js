const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema({
    stateCode: {
        type: String,
        required: true,
        unique: true
    },
    funfacts: {
        type: [String] // Array of strings
    }
});

// Middleware to enforce uppercase stateCode before saving to MongoDB
stateSchema.pre('save', function (next) {
    this.stateCode = this.stateCode.toUpperCase();
    next();
});

module.exports = mongoose.model('State', stateSchema);
