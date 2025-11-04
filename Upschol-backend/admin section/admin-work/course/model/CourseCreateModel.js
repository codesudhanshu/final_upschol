const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true,
    trim: true
  },
  courseDescription: {
    type: String,
    required: true,
    trim: true
  },
  courseCategory: {
    type: String, 
    required: true
  },
  prerequisites: {
    type: String,
    trim: true
  },
  duration: {
    type: String,
    required: true,
    trim: true
  },
  createdBy: {
    type: String,
    ref: 'Admin',
    required: false
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

courseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const AllCourse = mongoose.model('AllCourse', courseSchema);
module.exports = AllCourse;