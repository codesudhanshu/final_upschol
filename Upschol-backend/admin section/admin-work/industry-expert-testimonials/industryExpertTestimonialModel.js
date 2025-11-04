const mongoose = require('mongoose')

const expertSchema = new mongoose.Schema({
  image: { type: String, required: true  }, 
  name: {type: String, required: true},
  designation: { type: String, required: true },
  companyname: { type: String, required: true },
  linkedinurl: { type: String },
  testimonials : { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: String, required: true }
});

const IndustryExpertTestimonials = mongoose.model('IndustryExpertTestimonials`', expertSchema);
module.exports = IndustryExpertTestimonials