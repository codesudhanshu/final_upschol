const AllCourse = require('../course/model/CourseCreateModel.js');
const University = require('../university/universityModel.js');
const announcement = require('./announcementModel.js');
const mongoose = require('mongoose');

exports.createannouncement = async (req) => {
  try {
    const announcements = new announcement({
      title: req.body.title,
      status: req.body.status || 'active',
      createdBy: 'Upschol'
    });
    
    await announcements.save();
    return { message: 'announcement created successfully', announcement };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getAllannouncements = async () => {
  try {
    const announcements = await announcement.find().sort({ createdAt: -1 });
    return { message: 'announcements fetched successfully', announcements };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getannouncement = async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid announcement ID');
    }
    
    const announcement = await announcement.findById(id);
    if (!announcement) {
      throw new Error('announcement not found');
    }
    
    return { message: 'announcement fetched successfully', announcement };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.updateannouncement = async (id, req) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid announcement ID');
    }

    let updateData = { ...req.body };

    const updatedannouncement = await announcement.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    
    if (!updatedannouncement) {
      throw new Error('announcement not found');
    }
    
    return { message: 'announcement updated successfully', announcement: updatedannouncement };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.deleteannouncement = async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid announcement ID');
    }
    
    const deletedannouncement = await announcement.findByIdAndDelete(id);
    if (!deletedannouncement) {
      throw new Error('announcement not found');
    }
    
    return { message: 'announcement deleted successfully' };
  } catch (error) {
    throw new Error(error.message);
  }
};


exports.getfooter = async () => {
  try {
    // Universities with populated courses
    const universities = await University.find({})
      .populate('selectedCourses.courseId', 'courseName')
      .select('universityName collegeUrl selectedCourses')
      .sort({ createdAt: -1 })
      .lean();

    // Course-university mapping
    const courseUniversityMap = {};

    universities.forEach(university => {
      university.selectedCourses.forEach(course => {
        if (course.courseId) {
          const courseId = course.courseId._id.toString();
          const courseName = course.courseId.courseName;
          
          if (!courseUniversityMap[courseId]) {
            courseUniversityMap[courseId] = {
              courseName: courseName,
              universities: []
            };
          }
          
          courseUniversityMap[courseId].universities.push({
            universityName: university.universityName,
            url: university.collegeUrl
          });
        }
      });
    });

    const result = Object.values(courseUniversityMap);

    return { 
      message: 'Footer data fetched successfully', 
      data: result 
    };
  } catch (error) {
    throw new Error(error.message);
  }
};