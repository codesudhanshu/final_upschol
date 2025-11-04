const mongoose = require('mongoose')

const expertSchema = new mongoose.Schema({
  image: { type: String, required: true  }, 
  name: {type: String, required: true},
  designation: { type: String, required: true },
  expertIn: { type: String, required: true },
  description: { type: String,  required: true  },
  experience: { type: String,  required: true  },
  // highestDegree: { type: String,  required: true  },
  rating: {type: Number,  required: true },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: String, required: true }
});

const IndustryExpert = mongoose.model('IndustryExpert', expertSchema);
module.exports = IndustryExpert