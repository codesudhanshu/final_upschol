const { uploadImage } = require('../../../services/s3.js');
const mongoose = require('mongoose');
const specializationData = require('./courseSpecializationModel.js')

exports.createspecialization = async (req) => {
  try {
    // Validate required fields
    if (!req.body.url || !req.body.description || !req.body.content) {
      throw new Error('URL, Description, and Content are required');
    }

    // Validate description length (max 60 words)
    const wordCount = req.body.description.trim().split(/\s+/).length;
    if (wordCount > 60) {
      throw new Error('Description should be maximum 60 words');
    }

    // Check for existing specialization with this URL
    const existingspecialization = await specializationData.findOne({ url: req.body.url.toLowerCase().trim() });
    if (existingspecialization) {
      return { message: 'A specialization with this URL already exists' };
    }

    // Process banner image
    let bannerImageUrl = '';
    if (req.files?.bannerImage) {
      const bannerResult = await uploadImage(req.files.bannerImage[0]);
      bannerImageUrl = bannerResult.Location;
    }

    // Process content images
    let content = req.body.content;
    const contentImageUrls = [];

    if (req.files?.images) {
      const contentImages = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      const tempIds = req.body.tempIds ? (Array.isArray(req.body.tempIds) ? req.body.tempIds : [req.body.tempIds]) : [];
      const altTexts = req.body.altTexts ? (Array.isArray(req.body.altTexts) ? req.body.altTexts : [req.body.altTexts]) : [];
      const imageDescriptions = req.body.imageDescriptions ? (Array.isArray(req.body.imageDescriptions) ? req.body.imageDescriptions : [req.body.imageDescriptions]) : [];

      for (let i = 0; i < contentImages.length; i++) {
        const file = contentImages[i];
        const tempId = tempIds[i] || `temp-image-${i}`;
        const altText = altTexts[i] || '';
        const imageDesc = imageDescriptions[i] || '';
        
        try {
          const result = await uploadImage(file);

          // Store image info as object
          const imageInfo = {
            url: result.Location,
            altText: altText,
            description: imageDesc,
            fileName: file.originalname
          };
          contentImageUrls.push(imageInfo);

          // Create the actual image tag with S3 URL
          const actualImgTag = `<img src="${result.Location}" alt="${altText.replace(/"/g, '&quot;')}" style="max-width: 100%; max-height: 300px;" class="my-2">`;
          
          // Replace temporary image by data-temp-id
          const tempImgRegex = new RegExp(`<img[^>]*data-temp-id="${tempId}"[^>]*>`, 'g');
          if (tempImgRegex.test(content)) {
            content = content.replace(tempImgRegex, actualImgTag);
          } else {
            // Fallback: replace blob URLs
            const blobUrlRegex = /blob:http:\/\/localhost:3000\/[a-f0-9-]+/g;
            content = content.replace(blobUrlRegex, (match) => {
              // Only replace if this is likely our image
              if (content.includes(`data-temp-id="${tempId}"`)) {
                return result.Location;
              }
              return match;
            });
          }

          // Add description if provided
          if (imageDesc) {
            const descDiv = `<div class="text-sm text-gray-600 italic mb-4 text-center">${imageDesc}</div>`;
            // Add description after the image
            content = content.replace(
              new RegExp(`(<img[^>]*src="${result.Location.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>)`),
              `$1${descDiv}`
            );
          }

        } catch (uploadError) {
          console.error('Error uploading image:', uploadError);
          throw new Error(`Failed to upload image: ${file.originalname}`);
        }
      }
    }

    // Create specialization with proper contentImages structure
    const specializationData1 = {
      title: req.body.title.trim(),
      url: req.body.url.toLowerCase().trim(),
      description: req.body.description.trim(),
      content: content,
      bannerImage: bannerImageUrl,
      keywords: req.body.keywords?.split(',').map(k => k.trim()).filter(k => k) || [],
      createdBy: req.user?.id || 'Upschol'
    };

    const specialization = new specializationData(specializationData1);
    await specialization.save();
    
    return { message: 'specialization created successfully', specialization };
  } catch (error) {
    console.error('Error in createspecialization:', error);
    if (error.code === 11000) {
      return { message: 'Error in createspecialization' };
    }
    return { message: 'Error in createspecialization' };
  }
};

exports.getAllspecializations = async () => {
  try {
    const specializations = await specializationData.find().sort({ createdAt: -1 });
    return { message: 'specializations fetched successfully', specializations };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getAllspecializationshome = async () => {
  try {
    const specializations = await specializationData.find().sort({ createdAt: -1 })
                                  .limit(5);
    return { message: 'specializations fetched successfully', specializations };
  } catch (error) {
    throw new Error(error.message);
  }
}


exports.getspecializationByurl = async (url) => {
  try {
    
    const specialization = await specializationData.find({url: url});
    if (!specialization) {
      throw new Error('specialization not found');
    }
    
    return { message: 'specialization fetched successfully', specialization };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getspecializationById = async (id) => {
  try {
    const specialization = await specializationData.findById(id)
    if (!specialization) {
      throw new Error('specialization not found');
    }
    
    return { message: 'specialization fetched successfully', specialization };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.updatespecialization = async (id, req) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid specialization ID');
    }

    let updateData = { ...req.body };
    
    // ✅ 'bannerImage' check karo (not 'bannerImages')
    if (req.files?.bannerImage) {
      const bannerResult = await uploadImage(req.files.bannerImage[0], 'specialization-banners');
      updateData.bannerImage = bannerResult.Location;
    }

    // ✅ 'images' check karo (not 'contentImages')
    if (req.files?.images) {
      const contentImages = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      const tempIds = req.body.tempIds ? (Array.isArray(req.body.tempIds) ? req.body.tempIds : [req.body.tempIds]) : [];
      const altTexts = req.body.altTexts ? (Array.isArray(req.body.altTexts) ? req.body.altTexts : [req.body.altTexts]) : [];
      const imageDescriptions = req.body.imageDescriptions ? (Array.isArray(req.body.imageDescriptions) ? req.body.imageDescriptions : [req.body.imageDescriptions]) : [];

      let content = req.body.content;

      for (let i = 0; i < contentImages.length; i++) {
        const file = contentImages[i];
        const tempId = tempIds[i] || `temp-image-${i}`;
        const altText = altTexts[i] || '';
        const imageDesc = imageDescriptions[i] || '';

        try {
          const result = await uploadImage(file);
          
          // Create the actual image tag with S3 URL
          const actualImgTag = `<img src="${result.Location}" alt="${altText.replace(/"/g, '&quot;')}" style="max-width: 100%; max-height: 300px;" class="my-2">`;
          
          // Replace temporary image by data-temp-id
          const tempImgRegex = new RegExp(`<img[^>]*data-temp-id="${tempId}"[^>]*>`, 'g');
          if (tempImgRegex.test(content)) {
            content = content.replace(tempImgRegex, actualImgTag);
          }

          // Add description if provided
          if (imageDesc) {
            const descDiv = `<div class="text-sm text-gray-600 italic mb-4 text-center">${imageDesc}</div>`;
            content = content.replace(
              new RegExp(`(<img[^>]*src="${result.Location.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>)`),
              `$1${descDiv}`
            );
          }

        } catch (uploadError) {
          console.error('Error uploading image:', uploadError);
          throw new Error(`Failed to upload image: ${file.originalname}`);
        }
      }

      updateData.content = content;
    }

    const updatedspecialization = await specializationData.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    );
    
    return { 
      message: 'specialization updated successfully', 
      specialization: updatedspecialization 
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.deletespecialization = async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid specialization ID');
    }
    
    await specializationData.findByIdAndDelete(id);
    return { message: 'specialization deleted successfully' };
  } catch (error) {
    throw new Error(error.message);
  }
};