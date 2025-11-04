const mongoose = require('mongoose')

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  courseCategory: {type: String, required: true},
  course: {type: String, required: true},
  university: {type: String, required: true},
  image: { type: String, required: true }, 
  rating: { type: Number, min: 1, max: 5 },
  successStory: { type: String },
  workedAt: { type: String },
  admissionOn: { type: Date },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: String, required: true }
});

const Testimonials =  mongoose.model('Testimonials', testimonialSchema);
module.exports = Testimonials