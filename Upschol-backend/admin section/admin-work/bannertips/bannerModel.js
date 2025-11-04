const mongoose = require('mongoose')

const bannerSchema = new mongoose.Schema({
  image: { type: String, required: true }, // S3 URL
  title: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: String, required: true }
});

const Banner = mongoose.model('Banner', bannerSchema);
module.exports = Banner