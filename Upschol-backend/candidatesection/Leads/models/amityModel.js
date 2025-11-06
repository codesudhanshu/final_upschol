const mongoose = require('mongoose');

const AmitySchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
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
    submit_time:{
        type: Date,
        default: Date.now
    }
});

const amityModel = mongoose.models?.amitystudent || mongoose.model('amitystudent', AmitySchema);

module.exports = amityModel;