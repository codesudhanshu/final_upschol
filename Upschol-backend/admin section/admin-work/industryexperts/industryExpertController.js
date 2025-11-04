
const { uploadImage } = require('../../../services/s3.js');
const mongoose = require('mongoose');
const IndustryExpert = require('./industryExpertModel.js');

exports.createIndustryExpert = async (req) => {
  try {
    let imageUrl = '';
    if (req.file) {
      const result = await uploadImage(req.file);
      imageUrl = result.Location;
    }
    
    const expert = new IndustryExpert({
      ...req.body,
      image: imageUrl,
      createdBy: 'Upschol'
    });
    
    await expert.save();
    return { message: 'Industry expert created successfully', expert };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getAllIndustryExperts = async () => {
  try {
    const experts = await IndustryExpert.find().sort({ createdAt: -1 });
    return { message: 'Industry experts fetched successfully', experts };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getIndustryExpertById = async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid expert ID');
    }
    
    const expert = await IndustryExpert.findById(id);
    if (!expert) {
      throw new Error('Industry expert not found');
    }
    
    return { message: 'Industry expert fetched successfully', expert };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.updateIndustryExpert = async (id, req) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid expert ID');
    }

    let updateData = { ...req.body };
    
    if (req.file) {
      const result = await uploadImage(req.file);
      updateData.image = result.Location;
    }

    const updatedExpert = await IndustryExpert.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    
    return { message: 'Industry expert updated successfully', expert: updatedExpert };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.deleteIndustryExpert = async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid expert ID');
    }
    
    await IndustryExpert.findByIdAndDelete(id);
    return { message: 'Industry expert deleted successfully' };
  } catch (error) {
    throw new Error(error.message);
  }
};