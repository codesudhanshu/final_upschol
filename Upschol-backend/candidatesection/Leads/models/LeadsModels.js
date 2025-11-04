const mongoose = require('mongoose');

const LeadsSchema = new mongoose.Schema({
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
  couseCategory: {
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
    Scored:{
    type: String,
    trim: true
  },
    workingProfessional:{
    type: String,
    trim: true
  },
   prefferedLearningMethod:{
    type: String,
    trim: true
  },
    budget:{
    type: String,
    trim: true
  },
     prefferedEMI:{
    type: String,
    trim: true
  },
     EMIBudget:{
    type: String,
    trim: true
  },
   city: {
    type: String,
     trim: true
  },
  state:{
    type: String,
     trim: true
  },
  message:{
    type: String,
     trim: true
  },
  counsellorName: {
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
LeadsSchema .pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Leads = mongoose.model('Leads', LeadsSchema , 'Leads');
module.exports = Leads;
