const express = require('express');
const router = express.Router();
const { 
  createIndustryExpertTestimonials,
  getAllIndustryExpertsTestimonials,
  getAllIndustryExpertsTestimonialsHomepage,
  getIndustryExpertByIdTestimonials,
  updateIndustryExpertTestimonials,
  deleteIndustryExpertTestimonials
} = require('./industryExpertTestimonialController');
const { verifyAdminToken } = require('../../../utils/tokenAuthenticator');
const serviceResponse = require('../../../utils/serviceResponse');
const constant = require('../../../constant');
const multer = require('multer');
const storage = multer.memoryStorage(); // or diskStorage
const upload = multer({ storage });
module.exports = upload;

// Create Industry Expert
router.post('/create-industry-expert-testimonials', upload.single('image'), async (req, res) => {
  try {
    const result = await createIndustryExpertTestimonials(req);
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
router.get('/industry-experts-testimonials', async (req, res) => {
  try {
    const result = await getAllIndustryExpertsTestimonials();
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
router.get('/industry-experts-testimonials-homepage', async (req, res) => {
  try {
    const result = await getAllIndustryExpertsTestimonialsHomepage();
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
router.get('/industry-expert-testimonials/:id', async (req, res) => {
  try {
    const result = await getIndustryExpertByIdTestimonials(req.params.id);
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
router.put('/industry-expert-testimonials/:id', upload.single('image'), async (req, res) => {
  try {
    const result = await updateIndustryExpertTestimonials(req.params.id, req);
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
router.delete('/industry-expert-testimonials/:id', async (req, res) => {
  try {
    const result = await deleteIndustryExpertTestimonials(req.params.id);
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