const mongoose = require('mongoose');

const nmimsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    }
});

const nmimsModel = mongoose.models?.nmimsstudent || mongoose.model('nmimsstudent', nmimsSchema);

module.exports = nmimsModel;