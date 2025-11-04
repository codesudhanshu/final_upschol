const mongoose = require('mongoose');

const courseCategorySchema = new mongoose.Schema({
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
courseCategorySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const CourseCategories = mongoose.model('CourseCategory', courseCategorySchema, 'courseCategories');
module.exports = CourseCategories;
