
const mongoose = require('mongoose');
const AffiliatedInstitute = require('./approvaModell.js');
const { uploadImage } = require('../../../services/s3.js')

exports.createApproval = async (req) => {
  try {
    let imageUrl = '';
    console.log(req.file)
    if (req.file) {
      const result = await uploadImage(req.file);
      imageUrl = result.Location;
      console.log(imageUrl)
    }

    const approval = new AffiliatedInstitute({
      title: req.body.title,
      description: req.body.description,
      image: imageUrl,
      createdBy: 'Upschol'
    });
    
    await approval.save();
    return { message: 'Approval created successfully', approval };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getAllApprovals = async () => {
  try {
    const approvals = await AffiliatedInstitute.find().sort({ createdAt: -1 });
    return { message: 'Approvals fetched successfully', approvals };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getApprovalById = async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid approval ID');
    }
    
    const approval = await AffiliatedInstitute.findById(id);
    if (!approval) {
      throw new Error('Approval not found');
    }
    
    return { message: 'Approval fetched successfully', approval };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.updateApproval = async (id, req) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid approval ID');
    }

    let updateData = { ...req.body };
    
    if (req.file) {
      const result = await uploadImage(req.file);
      updateData.image = result.Location;
    }

    const updatedApproval = await AffiliatedInstitute.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    
    return { message: 'Approval updated successfully', approval: updatedApproval };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.deleteApproval = async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid approval ID');
    }
    
    await AffiliatedInstitute.findByIdAndDelete(id);
    return { message: 'Approval deleted successfully' };
  } catch (error) {
    throw new Error(error.message);
  }
};