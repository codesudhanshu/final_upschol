const { uploadFile } = require('../../../services/s3');
const Application = require('./AppJobModel');
const Job = require('./careersModel');
const mongoose = require('mongoose');

exports.createJob = async (req) => {
  try {
    const job = new Job({
      title: req.body.title,
      description: req.body.description,
      experience: req.body.experience,
      qualification: req.body.qualification,
      budget: req.body.budget,
      noticePeriod: req.body.noticePeriod,
      status: req.body.status || 'active',
      createdBy: 'Upschol',
    });
     
    await job.save();
    return { message: 'Job created successfully', job };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getAllJobs = async () => {
  try {
    const jobs = await Job.find({ status: "active" }).sort({ createdAt: -1 });
    return { message: 'Jobs fetched successfully', jobs };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getJob = async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid job ID');
    }
     
    const job = await Job.findById(id);
    if (!job) {
      throw new Error('Job not found');
    }
     
    return { message: 'Job fetched successfully', job };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.updateJob = async (id, req) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid job ID');
    }

    let updateData = { ...req };

    const updatedJob = await Job.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
     
    if (!updatedJob) {
      throw new Error('Job not found');
    }
     
    return { message: 'Job updated successfully', job: updatedJob };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.deleteJob = async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid job ID');
    }
     
    const deletedJob = await Job.findByIdAndDelete(id);
    if (!deletedJob) {
      throw new Error('Job not found');
    }
     
    return { message: 'Job deleted successfully' };
  } catch (error) {
    throw new Error(error.message);
  }
};


// Updated applyForJob function
exports.applyForJob = async (req) => {
  try {
    const { jobId } = req.params; // ✅ Yeh ab access hoga
    const { name, email, mobile_number, job_position, description } = req.body;

    // Check if job exists and is active
    const job = await Job.findById(jobId);
    if (!job) {
      throw new Error('Job not found');
    }
    if (job.status !== 'active') {
      throw new Error('This job is no longer accepting applications');
    }

    // Validate required fields
    if (!name || !email || !mobile_number || !job_position || !description) {
      throw new Error('All fields are required');
    }

    // Check if resume is uploaded
    if (!req.files?.resume) {
      throw new Error('Resume is required');
    }

    // Upload resume to S3
    const resumeFile = req.files.resume[0];
    const resumeResult = await uploadFile(resumeFile);

    // Check if user already applied for this job
    const existingApplication = await Application.findOne({
      jobId,
      email
    });

    if (existingApplication) {
      throw new Error('You have already applied for this job');
    }

    // Create application
    const application = new Application({
      jobId,
      name,
      email,
      mobile_number,
      job_position,
      description,
      resume: resumeResult.Location
    });

    await application.save();

    return {
      message: 'Application submitted successfully!',
      application
    };

  } catch (error) {
    console.error('Apply job error:', error);
    throw new Error(error.message);
  }
};

// Get all applications (for admin)
exports.getAllApplications = async (id) => {
  try {
    const applications = await Application.find({jobId : id})

    return {
      applications,
      total: applications.length
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Get applications by job ID
exports.getApplicationsByJobId = async (jobId) => {
  try {
    const applications = await Application.find({ jobId })
      .populate('jobId', 'title description')
      .sort({ appliedAt: -1 });

    return {
      applications,
      total: applications.length
    };
  } catch (error) {
    throw new Error(error.message);
  }
};