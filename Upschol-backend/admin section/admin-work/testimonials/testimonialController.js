const { uploadImage } = require('../../../services/s3.js');
const mongoose = require('mongoose');
const testimonialModel = require('./testimonialModel.js');
const University = require('../university/universityModel.js');
const CourseCategories = require('../course/model/courseModel.js');
const AllCourse = require('../course/model/CourseCreateModel.js');

exports.createTestimonial = async (req) => {
  try {
    let imageUrl = '';
    if (req.file) {
      const result = await uploadImage(req.file);
      imageUrl = result.Location;
    }
    
    const testimonial = new testimonialModel({
      ...req.body,
      image: imageUrl,
      createdAt: new Date(),
      createdBy: req.user?.id || 'Upschol'
    });
    
    await testimonial.save();
    return { message: 'Testimonial created successfully', testimonial };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getAllTestimonials = async () => {
  try {
    // First get all testimonials
    const testimonials = await testimonialModel.find().sort({ createdAt: -1 }).lean();
    
    // Create array to hold our transformed testimonials
    const transformedTestimonials = [];
    
    // Process each testimonial one by one
    for (const testimonial of testimonials) {
      // Initialize variables to store the names
      let universityName = 'N/A';
      let courseCategoryName = 'N/A';
      let courseName = 'N/A';
      
      // Fetch university name if university ID exists
      if (testimonial.university) {
        const university = await University.findById(testimonial.university).select('universityName');
        universityName = university?.universityName || 'N/A';
      }
      
      // Fetch course category name if courseCategory ID exists
      if (testimonial.courseCategory) {
        const category = await CourseCategories.findById(testimonial.courseCategory).select('name');
        courseCategoryName = category?.name || 'N/A';
      }
      
      // Fetch course name if course ID exists
      if (testimonial.course) {
        const course = await AllCourse.findById(testimonial.course).select('courseName');
        courseName = course?.courseName || 'N/A';
      }
      
      // Create new testimonial object with populated data
      const transformedTestimonial = {
        ...testimonial,
        university: universityName,
        courseCategory: courseCategoryName,
        course: courseName
      };
      
      transformedTestimonials.push(transformedTestimonial);
    }

    return { 
        message: 'Testimonials fetched successfully',
        testimonials: transformedTestimonials
    }
  } catch (error) {
    throw new Error(error.message);
  }
};


exports.getTestimonialById = async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid testimonial ID');
    }
    
    const testimonial = await testimonialModel.findById(id);
    if (!testimonial) {
      throw new Error('Testimonial not found');
    }
    
    return { message: 'Testimonial fetched successfully', testimonial };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.updateTestimonial = async (id, req) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid testimonial ID');
    }

    let updateData = { ...req.body };
    
    if (req.file) {
      const result = await uploadImage(req.file);
      updateData.image = result.Location;
    }

    const updatedTestimonial = await testimonialModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    
    return { message: 'Testimonial updated successfully', testimonial: updatedTestimonial };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.deleteTestimonial = async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid testimonial ID');
    }
    
    await testimonialModel.findByIdAndDelete(id);
    return { message: 'Testimonial deleted successfully' };
  } catch (error) {
    throw new Error(error.message);
  }
};