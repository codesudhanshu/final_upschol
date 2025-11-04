const { uploadImage } = require('../../../services/s3.js');
const mongoose = require('mongoose');
const blogData = require('./blogModel.js');


exports.createblog = async (req) => {
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

    // Check for existing blog with this URL
    const existingblog = await blogData.findOne({ url: req.body.url.toLowerCase().trim() });
    if (existingblog) {
      return { message: 'A blog with this URL already exists' };
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
    
    console.log('Files received:', req.files);
    console.log('Body received:', req.body);

    if (req.files?.images) {
      const contentImages = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      const tempIds = req.body.tempIds ? (Array.isArray(req.body.tempIds) ? req.body.tempIds : [req.body.tempIds]) : [];
      const altTexts = req.body.altTexts ? (Array.isArray(req.body.altTexts) ? req.body.altTexts : [req.body.altTexts]) : [];
      const imageDescriptions = req.body.imageDescriptions ? (Array.isArray(req.body.imageDescriptions) ? req.body.imageDescriptions : [req.body.imageDescriptions]) : [];

      console.log('Processing images:', contentImages.length);

      for (let i = 0; i < contentImages.length; i++) {
        const file = contentImages[i];
        const tempId = tempIds[i] || `temp-image-${i}`;
        const altText = altTexts[i] || '';
        const imageDesc = imageDescriptions[i] || '';

        console.log(`Uploading image ${i + 1}:`, file.originalname);
        
        try {
          const result = await uploadImage(file);
          console.log('Image uploaded to S3:', result.Location);

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
            console.log('Replaced image by temp ID');
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

    console.log('Final content:', content);
    console.log('Content images to save:', contentImageUrls);

    // Create blog with proper contentImages structure
    const blogData1 = {
      title: req.body.title.trim(),
      url: req.body.url.toLowerCase().trim(),
      description: req.body.description.trim(),
      content: content,
      bannerImage: bannerImageUrl,
      keywords: req.body.keywords?.split(',').map(k => k.trim()).filter(k => k) || [],
      createdBy: req.user?.id || 'Upschol'
    };

    console.log('blog data to save:', blogData1);

    const blog = new blogData(blogData1);
    await blog.save();
    
    console.log('blog saved successfully');
    return { message: 'blog created successfully', blog };
  } catch (error) {
    console.error('Error in createblog:', error);
    if (error.code === 11000) {
      return { message: 'Error in createblog' };
    }
    return { message: 'Error in createblog' };
  }
};

exports.gettrendingblogs = async (url) => {
  try {
    
    let query = {};
    if (url) {
      query.url = { $ne: url }; // agar excludeUrl hai toh use filter mein add karo
    }

    const blogs = await blogData.find(query)
     .select('url title bannerImage createdBy createdAt')
      .sort({ createdAt: -1 })
      .limit(10);
    
   return { message: 'blogs fetched successfully', blogs };
  } catch (error) {
    // Error handle karo properly
   throw new Error(error.message);
  }
};

exports.gettrendingdatablogs = async () => {
  try {

    const blogs = await blogData.find()
     .select('url title bannerImage createdBy createdAt')
      .sort({ createdAt: -1 })
      .limit(10);
    
   return { message: 'blogs fetched successfully', blogs };
  } catch (error) {
    // Error handle karo properly
   throw new Error(error.message);
  }
};


exports.getAllblogs = async () => {
  try {
    const blogs = await blogData.find()
     .select('url title description bannerImage createdBy createdAt')
     .sort({ createdAt: -1 });
    return { message: 'blogs fetched successfully', blogs };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getblogByUrl = async (url) => {
  try {
    
    const blog = await blogData.find({url: url});
    if (!blog) {
      throw new Error('blog not found');
    }
    
    return { message: 'blog fetched successfully', blog };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getblogById = async (id) => {
  try {
    console.log(id, "id")
    const blog = await blogData.findById(id);
    if (!blog) {
      throw new Error('blog not found');
    }
    
    return { message: 'blog fetched successfully', blog };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.updateblog = async (id, req) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid blog ID');
    }

    let updateData = { ...req.body };
    
    // ✅ 'bannerImage' check karo (not 'bannerImages')
    if (req.files?.bannerImage) {
      const bannerResult = await uploadImage(req.files.bannerImage[0], 'blog-banners');
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

    const updatedblog = await blogData.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    );
    
    return { 
      message: 'blog updated successfully', 
      blog: updatedblog 
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.deleteblog = async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid blog ID');
    }
    
    await blogData.findByIdAndDelete(id);
    return { message: 'blog deleted successfully' };
  } catch (error) {
    throw new Error(error.message);
  }
};