const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  isActive:{
    type: Boolean,
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
departmentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Department = mongoose.model('Department', departmentSchema);
module.exports = Department;
    