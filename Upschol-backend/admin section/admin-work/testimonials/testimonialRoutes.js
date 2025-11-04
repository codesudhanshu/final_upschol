const express = require('express');
const router = express.Router();
const { 
  createTestimonial,
  getAllTestimonials,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial
} = require('./testimonialController');
const { verifyAdminToken } = require('../../../utils/tokenAuthenticator');
const serviceResponse = require('../../../utils/serviceResponse');
const constant = require('../../../constant');
const multer = require('multer');
const storage = multer.memoryStorage(); // or diskStorage
const upload = multer({ storage });
module.exports = upload;

// Create Testimonial
router.post('/create-testimonial', upload.single('image'), async (req, res) => {
  try {
    const result = await createTestimonial(req);
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

// Get all Testimonials
router.get('/testimonials', async (req, res) => {
  try {
    const result = await getAllTestimonials();
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

// Get single Testimonial
router.get('/testimonial/:id', async (req, res) => {
  try {
    const result = await getTestimonialById(req.params.id);
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

// Update Testimonial
router.put('/testimonial/:id', upload.single('image'), async (req, res) => {
  try {
    const result = await updateTestimonial(req.params.id, req);
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

// Delete Testimonial
router.delete('/testimonial/:id', async (req, res) => {
  try {
    const result = await deleteTestimonial(req.params.id);
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