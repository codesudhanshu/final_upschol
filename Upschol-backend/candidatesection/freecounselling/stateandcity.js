const mongoose = require('mongoose');

const stateandcitiesSchema = new mongoose.Schema({
  state: {
    type: String,
    required: true,
    trim: true
  },
  districts: {
    type: Array,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Auto update updatedAt
stateandcitiesSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const stateandcities = mongoose.model('stateandcities', stateandcitiesSchema, 'stateandcities');
module.exports = stateandcities;
