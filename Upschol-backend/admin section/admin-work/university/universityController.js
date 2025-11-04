const mongoose = require('mongoose');
const { uploadImage } = require('../../../services/s3');
const University = require('./universityModel');
const CourseCategories = require('../course/model/courseModel');
const AllCourse = require('../course/model/CourseCreateModel');
const Company = require('../companydetails/companyModel');
const AffiliatedInstitute = require('../approvals/approvaModell');

// Helper function to parse JSON strings safely
const parseJSON = (str) => {
  try {
    return JSON.parse(str);
  } catch (error) {
    console.error(`Failed to parse JSON: ${str}`, error);
    return [];
  }
};

exports.createUniversity = async (req) => {
  try {
    console.log("Received body:", req.body);
    console.log("Received files:", req.files);

    // Upload images to S3
    const logoPath = await uploadImage(req.files?.logo?.[0]);
    const homeImagePath = await uploadImage(req.files?.universityHomeImage?.[0]);
    const certificatePath = await uploadImage(req.files?.sampleCertificate?.[0]);

    if (!logoPath?.Location || !homeImagePath?.Location) {
      throw new Error('Logo and University Home Image are required.');
    }

    // Destructure body
    const {
      universityName,
      keywordDescription,
      universityRating,
      digitalInfrastructure,
      curriculum,
      valueForMoney,
      isGlobalCollege,
      isLocalCollege,
      aboutCollege,
      startingKeyPoints,
      universityFacts,
      sampleCertificateDescription,
      universityAddress,
      city,
      pincode,
      state,
      country,
      admissionProcess,
      faqs,
      examinationPatterns,
      advantages,
      collegeUrl,
      keyword,
      rankings,
      reviews,
      selectedApprovals,
      selectedCompanies,
      selectedCourses,
      financialOptions
    } = req.body;

    const universityData = {
      universityName,
      keywordDescription,
      universityRating: parseFloat(universityRating) || 0,
      digitalInfrastructure: parseFloat(digitalInfrastructure) || 0,
      curriculum: parseFloat(curriculum) || 0,
      valueForMoney: parseFloat(valueForMoney) || 0,
      isGlobalCollege: isGlobalCollege === 'true' || isGlobalCollege === true,
      isLocalCollege: isLocalCollege === 'true' || isLocalCollege === true,
      aboutCollege,
      startingKeyPoints: typeof startingKeyPoints === 'string' ? parseJSON(startingKeyPoints) : startingKeyPoints || [],
      universityFacts: typeof universityFacts === 'string'
        ? parseJSON(universityFacts).map(f => ({ fact: f.fact }))
        : universityFacts || [],
      logo: logoPath.Location,
      universityHomeImage: homeImagePath.Location,
      sampleCertificate: certificatePath?.Location || null,
      sampleCertificateDescription,
      universityAddress,
      city,
      pincode,
      state,
      country,
      admissionProcess,
      faqs: typeof faqs === 'string' ? parseJSON(faqs) : faqs || [],
      examinationPatterns: typeof examinationPatterns === 'string'
        ? parseJSON(examinationPatterns)
        : examinationPatterns || [],
      advantages: typeof advantages === 'string'
        ? parseJSON(advantages).map(adv => ({
            description: adv.description,
            benefits: Array.isArray(adv.benefits)
              ? adv.benefits.map(b => ({ description: b }))
              : []
          }))
        : advantages || [],
      rankings: typeof rankings == 'string'
        ? parseJSON(rankings).map(rank => ({
            RatingNumber: rank.RatingNumber,
            RatingDescription: rank.RatingDescription,
          }))
        : rankings || [],
      reviews: typeof reviews == 'string'
        ? parseJSON(reviews).map(rev => ({
            name: rev.name,
            Rating: rev.Rating,
            description: rev.description   
          }))
        : rankings || [],
      collegeUrl,
      keyword,
      selectedApprovals: typeof selectedApprovals === 'string'
        ? parseJSON(selectedApprovals).map(id => new mongoose.Types.ObjectId(id)
)
        : selectedApprovals || [],
      selectedCompanies: typeof selectedCompanies === 'string'
        ? parseJSON(selectedCompanies).map(id => new mongoose.Types.ObjectId(id)
)
        : selectedCompanies || [],
      selectedCourses: typeof selectedCourses === 'string'
        ? parseJSON(selectedCourses).map(course => ({
            courseId: new mongoose.Types.ObjectId(course.courseId),
            semesterPrice: parseFloat(course.semesterPrice),
            annualPrice: parseFloat(course.annualPrice),
            oneTimePrice: parseFloat(course.oneTimePrice),
            totalAmount: parseFloat(course.totalAmount),
            loanAmount: parseFloat(course.loanAmount)
          }))
        : selectedCourses || [],
      financialOptions: typeof financialOptions === 'string'
        ? parseJSON(financialOptions)
        : financialOptions || []
    };

    console.log("Prepared universityData:", JSON.stringify(universityData, null, 2));

    const universities = new University(universityData);
    
    try {
      const savedUniversity = await universities.save();
      return {
        message: 'University created successfully',
        data: savedUniversity
      };
    } catch (err) {
      console.error("Error while saving university:", err);
      throw err;
    }

  } catch (error) {
    console.error("CREATE UNIVERSITY ERROR:", error.message, error);
    throw error;
  }
};


// Get All Universities (with pagination)
exports.getAllUniversities = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const universities = await University.find()
      .populate('selectedApprovals')
      .populate('selectedCompanies')
      .populate('selectedCourses.courseId')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    return {
        message: "All Univeristy Data Fetched SuccessFully",
      count: universities.length,
      data: universities
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Get Single University
exports.getUniversityById = async (req, res) => {
  try {
    const university = await University.findById(req.params.id)
      .populate('selectedApprovals')
      .populate('selectedCompanies')
      .populate('selectedCourses.courseId');

    if (!university) {
      return res.status(404).json({
        success: false,
        message: 'University not found'
      });
    }

    return {
        message : "University data fetched",
      data: university
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

// Update University
exports.updateUniversity = async (req, res) => {
  try {
    const university = await University.findById(req.params.id);
    if (!university) {
      return res.status(404).json({
        success: false,
        message: 'University not found'
      });
    }

    // Handle file uploads
    const logoPath = req.files?.logo?.[0] 
      ? uploadImage(req.files.logo[0]) 
      : null;
    const homeImagePath = req.files?.universityHomeImage?.[0]
      ? uploadImage(req.files.universityHomeImage[0])
      : null;
    const certificatePath = req.files?.sampleCertificate?.[0]
      ? uploadImage(req.files.sampleCertificate[0])
      : null;

    // Parse form data
    const formData = JSON.parse(req.body.formData || '{}');

    // Update fields
    Object.keys(formData).forEach(key => {
      university[key] = formData[key];
    });

    // Update files if new ones are uploaded
    if (logoPath) {
      deleteFile(university.logo);
      university.logo = logoPath;
    }
    if (homeImagePath) {
      deleteFile(university.universityHomeImage);
      university.universityHomeImage = homeImagePath;
    }
    if (certificatePath) {
      deleteFile(university.sampleCertificate);
      university.sampleCertificate = certificatePath;
    }

    await university.save();

    return {
      message: 'University updated successfully',
      data: university
    }

  } catch (error) {
    throw new Error(error.message);
  }
};

// Delete University
exports.deleteUniversity = async (req, res) => {
  try {
    const university = await University.findByIdAndDelete(req.params.id);
    if (!university) {
      return res.status(404).json({
        success: false,
        message: 'University not found'
      });
    }

    // Delete associated files
    deleteFile(university.logo);
    deleteFile(university.universityHomeImage);
    deleteFile(university.sampleCertificate);

    return {
      message: 'University deleted successfully'
    }
  } catch (error) {
    throw new Error(error.message);
  }
};




exports.getAllpartnersdata = async (req, res) => {
  try {
    const universities = await University.find({})
      .select('universityName collegeUrl universityHomeImage keywordDescription _id selectedCourses logo');

    return {
      message: "All University Data Fetched Successfully",
      count: universities.length,
      data: universities
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getUniversityBycollegeUrl = async (collegeUrl) => {
  try {
    // Step 1: Find the university by collegeUrl
    const university = await University.findOne({ collegeUrl });
    
    if (!university) {
      throw new Error('University not found');
    }

    // Step 2: Extract all IDs needed for population
    const courseIds = university.selectedCourses.map(c => c.courseId);
    const affiliatedIds = university.selectedApprovals;
    const companyIds = university.selectedCompanies;

    // Step 3: Get all related data in parallel
    const [courses, affiliatedInstitutes, companies] = await Promise.all([
      AllCourse.find({ _id: { $in: courseIds } }),
      AffiliatedInstitute.find({ _id: { $in: affiliatedIds } }),
      Company.find({ _id: { $in: companyIds } })
    ]);

    // Step 4: Enrich the course data with pricing information
    const enrichedCourses = university.selectedCourses.map(univCourse => {
      const courseDetail = courses.find(c => c._id.equals(univCourse.courseId));
      
      return {
        ...courseDetail.toObject(),
        pricing: {
          semesterPrice: univCourse.semesterPrice,
          annualPrice: univCourse.annualPrice,
          oneTimePrice: univCourse.oneTimePrice,
          totalAmount: univCourse.totalAmount,
          loanAmount: univCourse.loanAmount
        }
      };
    });

    // Step 5: Prepare final response
    const responseData = {
      ...university.toObject(),
      selectedCourses: enrichedCourses,
      selectedApprovals: affiliatedInstitutes,
      selectedCompanies: companies
    };

    return {
      message: "University data fetched successfully",
      data: responseData
    };
  } catch (error) {
    throw new Error(error.message);
  }
};




exports.getMultipleUniversitiesData = async (collegeUrl) => {
  try {
    console.log(collegeUrl)
    if (!collegeUrl) {
      return { error: 'College URLs are required' }
    }

    // Split the URLs by the separator (assuming they're separated by '-vs-')
    const urlArray = collegeUrl.split('-vs-');
    
    if (urlArray.length === 0 || urlArray.length > 3) {
      return { error: 'Please provide 1 to 3 college URLs' }
    }

    // Fetch data for all universities in parallel
    const universitiesData = await Promise.all(
      urlArray.map(async (collegeUrl) => {
        // Step 1: Find the university by collegeUrl
        const university = await University.findOne({ collegeUrl }).lean();
        
        if (!university) {
          return { error: `University not found for URL: ${collegeUrl}` };
        }

        // Step 2: Extract all IDs needed for population
        const courseIds = university.selectedCourses.map(c => c.courseId);
        const affiliatedIds = university.selectedApprovals;
        const companyIds = university.selectedCompanies;

        // Step 3: Get all related data in parallel
        const [courses, affiliatedInstitutes, companies] = await Promise.all([
          AllCourse.find({ _id: { $in: courseIds } }).lean(),
          AffiliatedInstitute.find({ _id: { $in: affiliatedIds } }).lean(),
          Company.find({ _id: { $in: companyIds } }).lean()
        ]);

        // Step 4: Enrich the course data with pricing information
        const enrichedCourses = university.selectedCourses.map(univCourse => {
          const courseDetail = courses.find(c => c._id.toString() === univCourse.courseId.toString());
          
          return {
            ...courseDetail,
            pricing: {
              semesterPrice: univCourse.semesterPrice,
              annualPrice: univCourse.annualPrice,
              oneTimePrice: univCourse.oneTimePrice,
              totalAmount: univCourse.totalAmount,
              loanAmount: univCourse.loanAmount
            }
          };
        });

        // Step 5: Prepare university response
        return {
          ...university,
          selectedCourses: enrichedCourses,
          selectedApprovals: affiliatedInstitutes,
          selectedCompanies: companies
        };
      })
    );

    // Check if any universities weren't found
    const errors = universitiesData.filter(u => u.error);
    if (errors.length > 0) {
      return { 
        message: "Some universities not found",
        errors,
        data: universitiesData.filter(u => !u.error)
    }
    }

    console.log(universitiesData)
    return {
      message: "Universities data fetched successfully",
      data: universitiesData
    }
  } catch (error) {
    console.error('Error fetching universities data:', error);
    return{ error: 'Internal server error' };
  }
};