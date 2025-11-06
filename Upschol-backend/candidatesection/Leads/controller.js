const { sendEnquiryNotification, sendEnquiryNotificationamity, sendEnquiryNotificationmaninmims } = require("../../mailer/nodemailer")
const amityModel = require("./models/amityModel")
const lpuModel = require("./models/lpuModel")
const manipalModel = require("./models/manipalModel")
const nmimsModel = require("./models/nmimsModel")

const Leads = require("./models/LeadsModels");

exports.LeadsAdd = async (body) => {
  try {
    const Leadss = new Leads({
      name: body.name,
      email: body.email,
      phoneNumber: body.phoneNumber,
      universityName: body.universityName || "",
      courseName: body.courseName || "",
      couseCategory: body.couseCategory || "",
      latestQualification: body.latestQualification,
      Scored: body.Scored || "",
      workingProfessional: body.workingProfessional || "",
      prefferedLearningMethod: body.prefferedLearningMethod || "",
      budget: body.budget || "",
      prefferedEMI: body.prefferedEMI || "",
      EMIBudget: body.EMIBudget || "",
      city: body.city || "",
      state: body.state || "",
      message: body.message || "",
      counsellorName: body.counsellorName|| ""
    });      
    const result = await Leadss.save();
    return { message: 'Leads Submit successfully', result };
  } catch (error) {
    console.error("Error creating lead", error);
    throw new Error("Failed to create lead");
  }
};

exports.createLPUEnquiry = async (body) => {
  try {
    const { name, email, phoneNumber, course, location } = body;

    if (!name || !email || !phoneNumber || !course || !location) {
      throw new Error('All fields are required');
    }

    const newEntry = new lpuModel({
      name,
      email,
      phoneNumber,
      course,
      location
    });

    const college = "Lovely Professional University";
    await newEntry.save();
    await sendEnquiryNotification({ name, email, phoneNumber, college, course, location });
    
    return { message: 'Data saved successfully', result: newEntry };
  } catch (error) {
    console.error("Error creating enquiry", error);
    throw new Error("Failed to create enquiry");
  }
};

exports.createAmityEnquiry = async (body) => {
  try {
    const { first_name, last_name, email, phoneNumber, course, location } = body;

    if (!first_name || !last_name || !email || !phoneNumber || !course || !location) {
      throw new Error('All fields are required');
    }

    const newEntry = new amityModel({
      first_name,
      last_name,
      email,
      phoneNumber,
      course,
      location
    });

    const college = "Amity University";
    await newEntry.save();
    await sendEnquiryNotificationamity({ first_name, last_name, email, phoneNumber, course, college, location });
    
    return { message: 'Data saved successfully', result: newEntry };
  } catch (error) {
    console.error("Error creating enquiry", error);
    throw new Error("Failed to create enquiry");
  }
};

exports.createManipalEnquiry = async (body) => {
  try {
    const { name, email, phoneNumber, location } = body;

    if (!name || !email || !phoneNumber || !location) {
      throw new Error('All fields are required');
    }

    const newEntry = new manipalModel({
      name,
      email,
      phoneNumber,
      location
    });

    const college = "Manipal University";
    await newEntry.save();
    await sendEnquiryNotificationmaninmims({ name, email, phoneNumber, college, location });
    
    return { message: 'Data saved successfully', result: newEntry };
  } catch (error) {
    console.error("Error creating enquiry", error);
    throw new Error("Failed to create enquiry");
  }
};

exports.createNMIMSEnquiry = async (body) => {
  try {
    const { name, email, phoneNumber, location } = body;

    if (!name || !email || !phoneNumber || !location) {
      throw new Error('All fields are required');
    }

    const newEntry = new nmimsModel({
      name,
      email,
      phoneNumber,
      location
    });

    const college = "NMIMS University";
    await newEntry.save();
    await sendEnquiryNotificationmaninmims({ name, email, phoneNumber, college, location });
    
    return { message: 'Data saved successfully', result: newEntry };
  } catch (error) {
    console.error("Error creating enquiry", error);
    throw new Error("Failed to create enquiry");
  }
};


exports.LeadsDetails = async (req) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25;
    const skip = (page - 1) * limit;
    const search = req.query.search;

    let searchQuery = {};
    
    if (search) {
      const searchConditions = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { courseName: { $regex: search, $options: 'i' } },
        { universityName: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { state: { $regex: search, $options: 'i' } }
      ];

      // Phone number ke liye alag se handle karen
      // Pehle exact match try karen
      const exactPhoneMatch = await Leads.find({ 
        phoneNumber: parseInt(search) 
      }).limit(1);
      
      // Agar exact match milta hai toh usse bhi include karen
      if (exactPhoneMatch.length > 0) {
        searchConditions.push({ phoneNumber: parseInt(search) });
      }
      // Ya phir string conversion ke through search karen
      else if (/^\d+$/.test(search)) {
        // Convert all phone numbers to string during query
        const allLeads = await Leads.find({}).select('phoneNumber').lean();
        const matchingPhoneNumbers = allLeads
          .filter(lead => lead.phoneNumber.toString().includes(search))
          .map(lead => lead.phoneNumber);
        
        if (matchingPhoneNumbers.length > 0) {
          searchConditions.push({ phoneNumber: { $in: matchingPhoneNumbers } });
        }
      }

      searchQuery = { $or: searchConditions };
    }

    const result = await Leads.find(searchQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Leads.countDocuments(searchQuery);
    const totalPages = Math.ceil(total / limit);

    return {
      message: 'Leads fetched successfully',
      result,
      pagination: {
        currentPage: page,
        totalPages,
        totalLeads: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };
  } catch (error) {
    console.error("Error fetching leads", error);
    throw new Error("Failed to fetch leads");
  }
};