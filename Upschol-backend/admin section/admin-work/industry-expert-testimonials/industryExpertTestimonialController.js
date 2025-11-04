
const { uploadImage } = require('../../../services/s3.js');
const mongoose = require('mongoose');
const IndustryExpertTestimonials = require('./industryExpertTestimonialModel.js');

exports.createIndustryExpertTestimonials = async (req) => {
  try {
    let imageUrl = '';
    if (req.file) {
      const result = await uploadImage(req.file);
      imageUrl = result.Location;
    }
    
    const expert = new IndustryExpertTestimonials({
      ...req.body,
      image: imageUrl,
      createdBy: 'Upschol'
    });
    
    await expert.save();
    return { message: 'Industry expert testimonial created successfully', expert };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getAllIndustryExpertsTestimonials = async () => {
  try {
    const experts = await IndustryExpertTestimonials.find().sort({ createdAt: -1 });
    return { message: 'Industry experts fetched successfully', experts };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getAllIndustryExpertsTestimonialsHomepage = async () => {
  try {
    const experts = await IndustryExpertTestimonials.find().sort({ createdAt: -1 }).limit(10);
    return { message: 'Industry experts fetched successfully', experts };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getIndustryExpertByIdTestimonials = async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid expert ID');
    }
    
    const expert = await IndustryExpertTestimonials.findById(id);
    if (!expert) {
      throw new Error('Industry expert not found');
    }
    
    return { message: 'Industry expert fetched successfully', expert };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.updateIndustryExpertTestimonials = async (id, req) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid expert ID');
    }

    let updateData = { ...req.body };
    
    if (req.file) {
      const result = await uploadImage(req.file);
      updateData.image = result.Location;
    }

    const updatedExpert = await IndustryExpertTestimonials.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    
    return { message: 'Industry expert updated successfully', expert: updatedExpert };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.deleteIndustryExpertTestimonials = async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid expert ID');
    }
    
    await IndustryExpertTestimonials.findByIdAndDelete(id);
    return { message: 'Industry expert deleted successfully' };
  } catch (error) {
    throw new Error(error.message);
  }
};