const Banner = require('./bannerModel.js');
const { uploadImage } = require('../../../services/s3.js');
const mongoose = require('mongoose');

exports.createBanner = async (req) => {
  try {
    let imageUrl = '';
    if (req.file) {
      const result = await uploadImage(req.file);
      imageUrl = result.Location;
    }
    
    const banner = new Banner({
      title: req.body.title,
      description: req.body.description,
      image: imageUrl,
      createdBy: 'Upschol'
    });
    
    await banner.save();
    return { message: 'Banner created successfully', banner };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getAllBanners = async () => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });
    return { message: 'Banners fetched successfully', banners };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getBannerById = async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid banner ID');
    }
    
    const banner = await Banner.findById(id);
    if (!banner) {
      throw new Error('Banner not found');
    }
    
    return { message: 'Banner fetched successfully', banner };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.updateBanner = async (id, req) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid banner ID');
    }

    let updateData = { ...req.body };
    
    if (req.file) {
      const result = await uploadImage(req.file);
      updateData.image = result.Location;
    }

    const updatedBanner = await Banner.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    
    return { message: 'Banner updated successfully', banner: updatedBanner };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.deleteBanner = async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid banner ID');
    }
    
    await Banner.findByIdAndDelete(id);
    return { message: 'Banner deleted successfully' };
  } catch (error) {
    throw new Error(error.message);
  }
};