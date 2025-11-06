const mongoose = require('mongoose');

const lpuSchema = new mongoose.Schema({
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
    course: {
        type: String,
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

const lpuModel = mongoose.models?.lpustudent || mongoose.model('lpustudent', lpuSchema);
module.exports = lpuModel;