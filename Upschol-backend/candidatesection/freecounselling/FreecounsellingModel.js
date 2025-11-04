const mongoose = require('mongoose');

const freecounsellingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
     trim: true
  },
  state:{
    type: String,
    required: true,
     trim: true
  },
  city:{
    type: String,
    required: true,
     trim: true
  },
  courseCategory:{
    type: String,
    trim: true
  },
  courseName:{
    type: String,
    trim: true
  },
  universityName:{
    type: String,
    trim: true
  },
  latestQualification:{
    type: String,
    trim: true
  },
  coursebudget:{
   type: String,
    trim: true
  },
  ctratedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Auto update updatedAt
freecounsellingSchema .pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const freecounselling = mongoose.model('freecounselling', freecounsellingSchema , 'freecounselling');
module.exports = freecounselling;
