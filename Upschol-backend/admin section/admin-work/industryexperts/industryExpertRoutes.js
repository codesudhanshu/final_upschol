const express = require('express');
const router = express.Router();
const { 
  createIndustryExpert,
  getAllIndustryExperts,
  getIndustryExpertById,
  updateIndustryExpert,
  deleteIndustryExpert
} = require('./industryExpertController');
const { verifyAdminToken } = require('../../../utils/tokenAuthenticator');
const serviceResponse = require('../../../utils/serviceResponse');
const constant = require('../../../constant');
const multer = require('multer');
const storage = multer.memoryStorage(); // or diskStorage
const upload = multer({ storage });
module.exports = upload;

// Create Industry Expert
router.post('/create-industry-expert', upload.single('image'), async (req, res) => {
  try {
    const result = await createIndustryExpert(req);
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

// Get all Industry Experts
router.get('/industry-experts', async (req, res) => {
  try {
    const result = await getAllIndustryExperts();
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

// Get single Industry Expert
router.get('/industry-expert/:id', async (req, res) => {
  try {
    const result = await getIndustryExpertById(req.params.id);
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

// Update Industry Expert
router.put('/industry-expert/:id', upload.single('image'), async (req, res) => {
  try {
    const result = await updateIndustryExpert(req.params.id, req);
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

// Delete Industry Expert
router.delete('/industry-expert/:id', async (req, res) => {
  try {
    const result = await deleteIndustryExpert(req.params.id);
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

module.exports = function(app) {
  app.use('/admin', router);
};