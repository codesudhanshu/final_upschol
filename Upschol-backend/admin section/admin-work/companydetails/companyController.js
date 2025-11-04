
const { uploadImage } = require('../../../services/s3.js');
const mongoose = require('mongoose');
const Company = require('./companyModel.js');
exports.createCompany = async (req) => {
  try {
    let imageUrl = '';
    if (req.file) {
      const result = await uploadImage(req.file);
      imageUrl = result.Location;
    }
    
    const company = new Company({
      title: req.body.title,
      description: req.body.description,
      image: imageUrl,
      createdBy: req.user?.id || 'Upschol'
    });
    
    await company.save();
    return { message: 'Company created successfully', company };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getAllCompanies = async () => {
  try {
    const companies = await Company.find().sort({ createdAt: -1 });
    return { message: 'Companies fetched successfully', companies };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getCompanyById = async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid company ID');
    }
    
    const company = await Company.findById(id);
    if (!company) {
      throw new Error('Company not found');
    }
    
    return { message: 'Company fetched successfully', company };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.updateCompany = async (id, req) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid company ID');
    }

    let updateData = { ...req.body };
    
    if (req.file) {
      const result = await uploadImage(req.file);
      updateData.image = result.Location;
    }

    const updatedCompany = await Company.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    
    return { message: 'Company updated successfully', company: updatedCompany };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.deleteCompany = async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid company ID');
    }
    
    await Company.findByIdAndDelete(id);
    return { message: 'Company deleted successfully' };
  } catch (error) {
    throw new Error(error.message);
  }
};