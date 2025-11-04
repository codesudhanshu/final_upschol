const express = require('express');
const router = express.Router();
const { 
  createJob,
  getAllJobs,
  getJob,
  updateJob,
  deleteJob,
  applyForJob,
  getAllApplications
} = require('./careersController');
const { verifyAdminToken } = require('../../../utils/tokenAuthenticator');
const serviceResponse = require('../../../utils/serviceResponse');
const constant = require('../../../constant');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// Create announcement
router.post('/create-job', async (req, res) => {
  try {
    const result = await createJob(req);
    res.send(serviceResponse({
      result,
      status: constant.apiStatus.success,
      allowed: true
    }));
  } catch (error) {
    res.send(serviceResponse({
      error,
      status: constant.apiStatus.failed
    }));
  }
});

// Get all announcements
router.get('/job', async (req, res) => {
  try {
    const result = await getAllJobs();
    res.send(serviceResponse({
      result,
      status: constant.apiStatus.success,
      allowed: true
    }));
  } catch (error) {
    res.send(serviceResponse({
      error,
      status: constant.apiStatus.failed
    }));
  }
});


router.get('/job/:id', async (req, res) => {
  try {
    const result = await getJob(req.params.id);
    res.send(serviceResponse({
      result,
      status: constant.apiStatus.success,
      allowed: true
    }));
  } catch (error) {
    res.send(serviceResponse({
      error,
      status: constant.apiStatus.failed
    }));
  }
});

// Update announcement
router.put('/job/:id', async (req, res) => {
  try {
    const result = await updateJob(req.params.id, req.body);
    res.send(serviceResponse({
      result,
      status: constant.apiStatus.success,
      allowed: true
    }));
  } catch (error) {
    res.send(serviceResponse({
      error,
      status: constant.apiStatus.failed
    }));
  }
});

// Delete announcement
router.delete('/job/:id', async (req, res) => {
  try {
    const result = await deleteJob(req.params.id);
    res.send(serviceResponse({
      result,
      status: constant.apiStatus.success,
      allowed: true
    }));
  } catch (error) {
    res.send(serviceResponse({
      error,
      status: constant.apiStatus.failed
    }));
  }
});


router.post('/apply/:jobId', upload.fields([
  { name: 'resume', maxCount: 1 }
]), async (req, res) => {
  try {
    const result = await applyForJob(req);
    res.send(serviceResponse({
      result,
      status: constant.apiStatus.success,
      allowed: true
    }));
  } catch (error) {
    res.send(serviceResponse({
      error: error.message,
      status: constant.apiStatus.failed
    }));
  }
});

// Get all applications (admin)
router.get('/applications/:id', async (req, res) => {
  try {
    const result = await getAllApplications(req.params.id);
    res.send(serviceResponse({
      result,
      status: constant.apiStatus.success,
      allowed: true
    }));
  } catch (error) {
    res.send(serviceResponse({
      error: error.message,
      status: constant.apiStatus.failed
    }));
  }
});

module.exports = function(app) {
  app.use('/admin', router);
};