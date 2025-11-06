const mongoose = require('mongoose');
const { uploadImage } = require('../../../services/s3');
const University = require('./universityModel');
const CourseCategories = require('../course/model/courseModel');
const AllCourse = require('../course/model/CourseCreateModel');
const Company = require('../companydetails/companyModel');
const AffiliatedInstitute = require('../approvals/approvaModell');
const Department = require('../course/model/Department');
const Approval = require('../approvals/approvaModell');

// Helper function to validate ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};


const parseJSON = (str) => {
  try {
    return JSON.parse(str);
  } catch (error) {
    console.error('JSON Parse Error:', error.message);
    return null;
  }
};

exports.createUniversity = async (req) => {
  try {
    console.log("Received body:", req.body);
    console.log("Received files:", req.files);

    // ✅ FIX: Parse the main data from req.body.data
    const requestData = parseJSON(req.body.data);
    if (!requestData) {
      throw new Error('Invalid JSON data received');
    }

    console.log("Parsed requestData:", requestData);

    // Upload images to S3
    const logoPath = await uploadImage(req.files?.logo?.[0]);
    const homeImagePath = await uploadImage(req.files?.universityHomeImage?.[0]);
    const certificatePath = await uploadImage(req.files?.sampleCertificate?.[0]);

    if (!logoPath?.Location || !homeImagePath?.Location) {
      throw new Error('Logo and University Home Image are required.');
    }

    // ✅ FIX: Destructure from parsed requestData instead of req.body
    const {
      universityName,
      keywordDescription,
      universityRating,
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
      collegeUrl,
      keyword,
      collegeType,
      isDBA,
      faqs,
      examinationPatterns,
      advantages,
      rankings,
      reviews,
      selectedApprovals,
      selectedCompanies,
      selectedDepartments,
      financialAidContent,
      financialOptions
    } = requestData;

    // Process departments data with proper validation
    const processDepartments = (depts) => {
      if (!depts || !Array.isArray(depts)) return [];
      
      return depts.map(dept => {
        return {
          departmentId: isValidObjectId(dept.departmentId) 
            ? new mongoose.Types.ObjectId(dept.departmentId)
            : new mongoose.Types.ObjectId(),
          departmentName: dept.departmentName || 'Unknown Department',
          departmentContent: dept.departmentContent || '',
          feeDetails: {
            semesterFee: parseFloat(dept.feeDetails?.semesterFee) || 0,
            annualFee: parseFloat(dept.feeDetails?.annualFee) || 0,
            oneTimeFee: parseFloat(dept.feeDetails?.oneTimeFee) || 0,
            totalAmount: parseFloat(dept.feeDetails?.totalAmount) || 0,
            loanAmount: parseFloat(dept.feeDetails?.loanAmount) || 0
          },
          selectedCourses: processCourses(dept.selectedCourses || [])
        };
      });
    };

    // Process courses data
    const processCourses = (courses) => {
      return courses.map(course => {
        return {
          courseId: isValidObjectId(course.courseId)
            ? new mongoose.Types.ObjectId(course.courseId)
            : new mongoose.Types.ObjectId(),
          courseName: course.courseName || 'Unknown Course',
          courseContent: course.courseContent || '',
          feeDetails: {
            semesterFee: parseFloat(course.feeDetails?.semesterFee) || 0,
            annualFee: parseFloat(course.feeDetails?.annualFee) || 0,
            oneTimeFee: parseFloat(course.feeDetails?.oneTimeFee) || 0,
            totalAmount: parseFloat(course.feeDetails?.totalAmount) || 0,
            loanAmount: parseFloat(course.feeDetails?.loanAmount) || 0
          },
          selectedSpecializations: processSpecializations(course.selectedSpecializations || [])
        };
      });
    };

    // Process specializations data
    const processSpecializations = (specializations) => {
      return specializations.map(spec => {
        return {
          specializationId: isValidObjectId(spec.specializationId)
            ? new mongoose.Types.ObjectId(spec.specializationId)
            : new mongoose.Types.ObjectId(),
          specializationName: spec.specializationName || 'Unknown Specialization'
        };
      });
    };

    // Process approvals and companies
    const processReferences = (items) => {
      if (!items || !Array.isArray(items)) return [];
      
      return items.map(item => ({
        _id: isValidObjectId(item._id) 
          ? new mongoose.Types.ObjectId(item._id)
          : new mongoose.Types.ObjectId(),
        title: item.title || 'Unknown'
      }));
    };

    // Helper function to validate ObjectId
    const isValidObjectId = (id) => {
      return mongoose.Types.ObjectId.isValid(id);
    };

    // ✅ FIX: Now use the actual data from requestData
    const universityData = {
      // Basic Information
      universityName: universityName || 'Unknown University',
      keywordDescription: keywordDescription || '',
      universityRating: Math.min(5, Math.max(0, parseFloat(universityRating) || 0)),
      collegeType: collegeType || 'local',
      isDBA: isDBA === 'true' || isDBA === true,
      
      // About Section
      aboutCollege: aboutCollege || '',
      startingKeyPoints: Array.isArray(startingKeyPoints) 
        ? startingKeyPoints 
        : [],
      
      universityFacts: Array.isArray(universityFacts)
        ? universityFacts
        : [],
      
      // Media
      logo: logoPath.Location,
      universityHomeImage: homeImagePath.Location,
      sampleCertificate: certificatePath?.Location || '',
      sampleCertificateDescription: sampleCertificateDescription || '',
      
      // Location
      universityAddress: universityAddress || '',
      city: city || '',
      pincode: pincode || '',
      state: state || '',
      country: country || '',
      
      // Academics
      admissionProcess: admissionProcess || '',
      faqs: Array.isArray(faqs) ? faqs : [],
      
      examinationPatterns: Array.isArray(examinationPatterns)
        ? examinationPatterns
        : [],
      
      advantages: Array.isArray(advantages)
        ? advantages
        : [],
      
      // SEO & URL - Use actual collegeUrl from data or generate from name
      collegeUrl: (collegeUrl || universityName || 'unknown-university')
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, ''),
      keyword: keyword || '',
      
      // Affiliations & Partners
      selectedApprovals: processReferences(
        Array.isArray(selectedApprovals) ? selectedApprovals : []
      ),
      
      selectedCompanies: processReferences(
        Array.isArray(selectedCompanies) ? selectedCompanies : []
      ),
      
      // Departments & Courses
      selectedDepartments: processDepartments(
        Array.isArray(selectedDepartments) ? selectedDepartments : []
      ),
      
      // Rankings & Reviews
      rankings: Array.isArray(rankings) ? rankings : [],
      
      reviews: Array.isArray(reviews)
        ? reviews.map(rev => ({
            name: rev.name || 'Anonymous',
            Rating: Math.min(5, Math.max(1, parseInt(rev.Rating) || 3)),
            description: rev.description || ''
          }))
        : [],
      
      // Financial Aid
      financialAidContent: financialAidContent || '',
      financialOptions: Array.isArray(financialOptions) ? financialOptions : []
    };

    console.log("Prepared universityData:", JSON.stringify(universityData, null, 2));

    // Check if university with same URL already exists
    const existingUniversity = await University.findOne({ collegeUrl: universityData.collegeUrl });
    if (existingUniversity) {
      throw new Error('University with this URL already exists');
    }

    const university = new University(universityData);
    
    const savedUniversity = await university.save();
    
    return {
      success: true,
      message: 'University created successfully',
      data: savedUniversity,
      totalDepartments: savedUniversity.selectedDepartments.length,
      totalCourses: savedUniversity
    };

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
      .select('universityName collegeUrl _id universityHomeImage logo');

      console.log(universities)

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

    // Step 2: Extract all IDs from the NEW schema structure
    const courseIds = [];
    const specializationIds = [];
    const approvalIds = university.selectedApprovals.map(approval => approval._id);
    const companyIds = university.selectedCompanies.map(company => company._id);

    // Get all course and specialization IDs from departments
    university.selectedDepartments.forEach(dept => {
      dept.selectedCourses.forEach(course => {
        courseIds.push(course.courseId);
        course.selectedSpecializations.forEach(spec => {
          specializationIds.push(spec.specializationId);
        });
      });
    });

    // Step 3: Get all related data in parallel
    const [courses, specializations, approvals, companies] = await Promise.all([
      AllCourse.find({ _id: { $in: courseIds } }),
      Department.find({ _id: { $in: specializationIds } }),
      Approval.find({ _id: { $in: approvalIds } }), // Change to Approval model
      Company.find({ _id: { $in: companyIds } })
    ]);

    // Step 4: Enrich departments with course and specialization details
    const enrichedDepartments = university.selectedDepartments.map(dept => {
      const enrichedCourses = dept.selectedCourses.map(course => {
        // Find course details
        const courseDetail = courses.find(c => c._id.toString() === course.courseId.toString());
        
        // Find specialization details
        const enrichedSpecializations = course.selectedSpecializations.map(spec => {
          const specDetail = specializations.find(s => s._id.toString() === spec.specializationId.toString());
          return {
            ...spec.toObject(),
            ...(specDetail ? specDetail.toObject() : {})
          };
        });

        return {
          ...course.toObject(),
          ...(courseDetail ? courseDetail.toObject() : {}),
          selectedSpecializations: enrichedSpecializations
        };
      });

      return {
        ...dept.toObject(),
        selectedCourses: enrichedCourses
      };
    });

    // Step 5: Enrich approvals and companies
    const enrichedApprovals = university.selectedApprovals.map(approval => {
      const approvalDetail = approvals.find(a => a._id.toString() === approval._id.toString());
      return {
        ...approval.toObject(),
        ...(approvalDetail ? approvalDetail.toObject() : {})
      };
    });

    const enrichedCompanies = university.selectedCompanies.map(company => {
      const companyDetail = companies.find(c => c._id.toString() === company._id.toString());
      return {
        ...company.toObject(),
        ...(companyDetail ? companyDetail.toObject() : {})
      };
    });

    // Step 6: Prepare final response
    const responseData = {
      ...university.toObject(),
      selectedDepartments: enrichedDepartments,
      selectedApprovals: enrichedApprovals,
      selectedCompanies: enrichedCompanies
    };

    return {
      success: true,
      message: "University data fetched successfully",
      data: responseData
    };
  } catch (error) {
    console.error("GET UNIVERSITY ERROR:", error.message);
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