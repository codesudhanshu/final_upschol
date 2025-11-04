const mongoose = require('mongoose');

// Define the University Schema
const universitySchema = new mongoose.Schema({
  universityName: { type: String, required: true },
  keywordDescription: { type: String },
  universityRating: { type: Number, default: 0 },
  digitalInfrastructure: { type: Number },
  curriculum: { type: Number },
  valueForMoney: { type: Number },
  isGlobalCollege: { type: Boolean, default: false },
  isLocalCollege: { type: Boolean, default: false },
  aboutCollege: { type: String },
  startingKeyPoints: [{ type: String }],
  universityFacts: [{ fact: { type: String } }],
  logo: { type: String, required: true },
  universityHomeImage: { type: String, required: true },
  sampleCertificate: { type: String },
  sampleCertificateDescription: { type: String },
  universityAddress: { type: String },
  city: { type: String },
  pincode: { type: String },
  state: { type: String },
  country: { type: String },
  admissionProcess: { type: String },
  faqs: [{
    question: { type: String },
    answer: { type: String }
  }],
  examinationPatterns: [{ pattern: { type: String } }],
  advantages: [{
    description: { type: String },
    benefits: [{ description: { type: String } }]
  }],
  collegeUrl: { 
    type: String,
    lowercase: true
  },
  keyword: { type: String },
  selectedApprovals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Approval'
  }],
  selectedCompanies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  }],
  selectedCourses: [{
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'AllCourse' },
    semesterPrice: { type: Number },
    annualPrice: { type: Number },
    oneTimePrice: { type: Number },
    totalAmount: { type: Number },
    loanAmount: { type: Number }
  }],
  Ranking : [{
    type: mongoose.Schema.Types.ObjectId,
    RatingNumber: { type: String},
    RatingDescription : {type: String},
  }],
  Reviews : [{
      type: mongoose.Schema.Types.ObjectId,
      name: {type: String},
      Rating : { type : Number},
      description: {type : String},
  }],
  financialOptions: [{
    category: { type: String },
    scholarshipCredit: { type: String },
    eligibilityDocuments: { type: String }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Create the University Model
const University = mongoose.model('newUniversity', universitySchema);
module.exports = University