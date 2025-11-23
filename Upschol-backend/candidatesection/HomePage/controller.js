const Banner = require("../../admin section/admin-work/bannertips/bannerModel");
const Company = require("../../admin section/admin-work/companydetails/companyModel");
const AllCourse = require("../../admin section/admin-work/course/model/CourseCreateModel");
const CourseCategories = require("../../admin section/admin-work/course/model/courseModel");
const FAQ = require("../../admin section/admin-work/faq/faqModel");
const IndustryExpert = require("../../admin section/admin-work/industryexperts/industryExpertModel");
const University = require("../../admin section/admin-work/university/universityModel");
const Testimonials = require('../../admin section/admin-work/testimonials/testimonialModel');
const announcement = require("../../admin section/admin-work/announcement/announcementModel");
const AffiliatedInstitute = require('../../admin section/admin-work/approvals/approvaModell');
const Department = require("../../admin section/admin-work/course/model/Department");

// app/api/admin/apiService.js
exports.getAllCoursesData = async () => {
  try {
    const [categories, courses, departments] = await Promise.all([
      CourseCategories.find(),
      AllCourse.find(), // populate hata diya kyunki schema mein nahi hai
      Department.find() // populate hata diya
    ]);

    const categoriesWithCourses = categories.map(category => {
      const relatedCourses = courses.filter(
        course => course.courseCategory === category.name
      ).map(course => ({
        ...course.toObject(),
        // Departments ko course ke hisaab se filter karenge
        specializations: departments.filter(dept => 
          dept.isActive && // sirf active departments
          // Yahan aap course aur department ka relation set kar sakte hain
          // Temporary logic - aap apne hisaab se change kar sakte hain
          dept.name.toLowerCase() ||
          course.courseName.toLowerCase().includes(dept.name.toLowerCase())
        )
      }));

      return {
        ...category.toObject(),
        courses: relatedCourses
      };
    });

    return categoriesWithCourses;

  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Failed to fetch categories with courses");
  }
};


exports.getAllTestimonialsData = async () => {
  try {
    // Get 5 latest testimonials
    const testimonials = await Testimonials.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();
    
    // Process each testimonial to populate names
    for (const testimonial of testimonials) {
      if (testimonial.university) {
        const university = await University.findById(testimonial.university).select('universityName');
        testimonial.university = university?.universityName || 'N/A';
      }
      
      if (testimonial.courseCategory) {
        const category = await CourseCategories.findById(testimonial.courseCategory).select('name');
        testimonial.courseCategory = category?.name || 'N/A';
      }
      
      if (testimonial.course) {
        const course = await AllCourse.findById(testimonial.course).select('courseName');
        testimonial.course = course?.courseName || 'N/A';
      }
    }

    return testimonials;
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getAllIndustryExpertsData = async () => {
  try {
    const experts = await IndustryExpert.find()
      .sort({ createdAt: -1 })
      .limit(10);
    return experts;  // Simply return the array of 5 experts
  } catch (error) {
    throw new Error(error.message);
  }
};


exports.getAllFAQsData = async () => {
  return await FAQ.find().populate('createdBy', 'name email').limit(5);
};


exports.getAllCompaniesData = async () => {
  try {
    const companies = await Company.find().sort({ createdAt: -1 });
    return { message: 'Companies fetched successfully', companies };
  } catch (error) {
    throw new Error(error.message);
  }
};


exports.getAllBannersData = async () => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 }).limit(5);
    return { message: 'Banners fetched successfully', banners };
  } catch (error) {
    throw new Error(error.message);
  }
};


exports.getAllannouncementsData = async () => {
  try {
    const announcements = await announcement.find().sort({ createdAt: -1 }).limit(5);
    return { message: 'announcements fetched successfully', announcements };
  } catch (error) {
    throw new Error(error.message);
  }
};


// backend route - searchUniversities function
exports.searchUniversities = async (req) => {
  try {
    const { categoryId, courseId, specialization, page = 1, limit = 9 } = req.query;
    
    let universities = [];

    // If filters are provided
    if (categoryId || courseId || specialization) {
      let courseFilter = {};
      
      if (categoryId && categoryId.trim() !== '') {
        courseFilter.courseCategory = categoryId;
      }
      if (courseId && courseId.trim() !== '') {
        courseFilter._id = courseId;
      }

      const courses = await AllCourse.find(courseFilter);
      
      if (courses.length === 0) return { universities: [], totalPages: 0, currentPage: 1 };
      
      const courseIds = courses.map(c => c._id);
      
      let universityFilter = {
        'selectedCourses.courseId': { $in: courseIds }
      };

      // Add specialization filter if provided
      if (specialization && specialization.trim() !== '') {
        universityFilter['selectedCourses.specializations.name'] = { 
          $regex: specialization, 
          $options: 'i' 
        };
      }

      universities = await University.find(universityFilter);
    } else {
      universities = await University.find({});
    }

    // Pagination logic
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = pageNum * limitNum;
    const totalPages = Math.ceil(universities.length / limitNum);
    
    const paginatedUniversities = universities.slice(startIndex, endIndex);

    // Get all affiliated institutes
    const allAffiliatedInstitutes = await AffiliatedInstitute.find({}, { title: 1 });
    
    const affiliatedMap = {};
    allAffiliatedInstitutes.forEach(inst => {
      affiliatedMap[inst._id.toString()] = inst.title;
    });

    // Prepare response
    const response = paginatedUniversities.map(university => {
      const universityAffiliatedNames = university.selectedApprovals
        .map(approval => {
          try {
            let approvalId;
            
            if (approval && approval._id) {
              approvalId = approval._id;
            } else if (approval && approval.id) {
              approvalId = approval.id;
            } else {
              approvalId = approval;
            }
            
            return affiliatedMap[approvalId.toString()];
          } catch (err) {
            console.log("Error mapping approval:", approval);
            return null;
          }
        })
        .filter(name => name);

      return {
        _id: university._id,
        title: university.universityName,
        logo: university.logo,
        bannerImage: university.universityHomeImage,
        affiliatedInstitutes: universityAffiliatedNames,
        rating: university.universityRating,
        universityurl: university.collegeUrl
      };
    });

    return {
      universities: response,
      totalPages,
      currentPage: pageNum,
      totalUniversities: universities.length
    };

  } catch (error) {
    console.error("Error in searchUniversities:", error);
    throw new Error("Failed to search universities");
  }
};
