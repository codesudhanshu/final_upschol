const mongoose = require('mongoose');

const manipalSchema = new mongoose.Schema({
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

const manipalModel = mongoose.models?.manipalstudent || mongoose.model('manipalstudent', manipalSchema);

module.exports = manipalModel;