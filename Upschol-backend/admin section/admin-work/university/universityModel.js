const mongoose = require('mongoose');

const universitySchema = new mongoose.Schema({
  universityName: { type: String, required: true },
  keywordDescription: { type: String },
  universityRating: { type: Number, default: 0 },
  digitalInfrastructure: { type: Number },
  curriculum: { type: Number },
  valueForMoney: { type: Number },
  collegeType: { type: String, enum: ['global', 'local'] },
  isDBA: { type: Boolean, default: false },
  
  // About Section
  aboutCollege: { type: String },
  startingKeyPoints: [{ type: String }],
  universityFacts: [{ fact: { type: String } }],
  
  // Media
  logo: { type: String, required: true },
  universityHomeImage: { type: String, required: true },
  sampleCertificate: { type: String },
  sampleCertificateDescription: { type: String },
  
  // Location
  universityAddress: { type: String },
  city: { type: String },
  pincode: { type: String },
  state: { type: String },
  country: { type: String },
  
  // Academics
  admissionProcess: { type: String },
  faqs: [{
    question: { type: String },
    answer: { type: String }
  }],
  examinationPatterns: [{ pattern: { type: String } }],
  advantages: [{
    description: { type: String },
    benefits: [{ type: String }]
  }],
  
  // SEO & URL
  collegeUrl: { 
    type: String,
    lowercase: true,
    unique: true
  },
  keyword: { type: String },
  
  // Affiliations & Partners
  selectedApprovals: [{
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Approval' },
    title: { type: String }
  }],
  selectedCompanies: [{
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    title: { type: String }
  }],
  
  // Departments & Courses (NEW STRUCTURE)
  selectedDepartments: [{
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    departmentName: { type: String },
    departmentContent: { type: String },
    feeDetails: {
      semesterFee: { type: Number, default: 0 },
      annualFee: { type: Number, default: 0 },
      oneTimeFee: { type: Number, default: 0 },
      totalAmount: { type: Number, default: 0 },
      loanAmount: { type: Number, default: 0 }
    },
    selectedCourses: [{
      courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
      courseName: { type: String },
      courseContent: { type: String },
      feeDetails: {
        semesterFee: { type: Number, default: 0 },
        annualFee: { type: Number, default: 0 },
        oneTimeFee: { type: Number, default: 0 },
        totalAmount: { type: Number, default: 0 },
        loanAmount: { type: Number, default: 0 }
      },
      selectedSpecializations: [{
        specializationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Specialization' },
        specializationName: { type: String }
      }]
    }]
  }],
  
  // Rankings & Reviews
  rankings: [{
    RatingNumber: { type: String },
    RatingDescription: { type: String }
  }],
  reviews: [{
    name: { type: String },
    Rating: { type: Number, min: 1, max: 5 },
    description: { type: String }
  }],
  
  // Financial Aid
  financialAidContent: { type: String },
  financialOptions: [{
    category: { type: String },
    scholarshipCredit: { type: String },
    eligibilityDocuments: { type: String }
  }],
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create the University Model
const University = mongoose.model('newUniversity', universitySchema);
module.exports = University;