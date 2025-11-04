const mongoose = require('mongoose')

const companySchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true }, // S3 URL
  description: { type: String },
  createdBy: { type: String, required: true },
  createdOn: { type: Date, default: Date.now }
});

const Company =  mongoose.model('Company', companySchema);
module.exports = Company