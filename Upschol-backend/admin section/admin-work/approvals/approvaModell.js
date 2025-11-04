const mongoose = require('mongoose')

const approvalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true }, // S3 URL
  description: { type: String },
  createdBy: { type: String, required: true },
  createdOn: { type: Date, default: Date.now }
});

const Approval = mongoose.model('AffiliatedInstitute', approvalSchema);
module.exports = Approval