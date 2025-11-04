const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true
  },
  url: { 
    type: String, 
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  description: { 
    type: String, 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  bannerImage: { 
    type: String,
    required: true 
  },
  keywords: [{ 
    type: String,
    trim: true ,
    required: true 
  }],
  createdBy: { 
    type: String, 
    default: 'Upschol' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Add text index for search functionality if needed
blogSchema.index({ title: 'text', description: 'text', keywords: 'text' });

const blogData = mongoose.model('blogData', blogSchema);
module.exports = blogData;