const express = require('express');
const router = express.Router();
const { 
  createspecialization,
  getAllspecializations,
  getspecializationById,
  updatespecialization,
  deletespecialization,
  getAllspecializationshome,
  getspecializationByurl
} = require('./courseSpecializationController');
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

// Create Blog - FIXED: Using correct field names
router.post('/create-specialization', upload.fields([
  { name: 'bannerImage', maxCount: 1 },
  { name: 'images', maxCount: 10 } // Changed from 'contentImages' to 'images'
]), async (req, res) => {
  try {
    const result = await createspecialization(req);
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



// Get all Blogs
router.get('/specialization', async (req, res) => {
  try {
    const result = await getAllspecializations();
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

router.get('/specializations-home', async (req, res) => {
  try {
    const result = await getAllspecializationshome();
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

// Get single Blog
router.get('/specialization/:url', async (req, res) => {
  try {
    const result = await getspecializationByurl(req.params.url);
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


router.get('/specializations/:id', async (req, res) => {
  try {
    const result = await getspecializationById(req.params.id);
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

// Update Blog
// ✅ CORRECT: Update route with proper field names
router.put('/specialization/:id', upload.fields([
  { name: 'bannerImage', maxCount: 1 },  // ✅ 'bannerImage' not 'bannerImages'
  { name: 'images', maxCount: 10 }       // ✅ 'images' not 'contentImages'
]), async (req, res) => {
  try {
    const result = await updatespecialization(req.params.id, req);
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

// Delete Blog
router.delete('/specialization/:id', async (req, res) => {
  try {
    const result = await deletespecialization(req.params.id);
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