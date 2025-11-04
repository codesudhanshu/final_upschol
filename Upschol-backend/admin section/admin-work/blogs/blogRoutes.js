const express = require('express');
const router = express.Router();
const { 
  createblog,
  getAllblogs,
  getblogById,
  updateblog,
  deleteblog,
  gettrendingblogs,
  gettrendingdatablogs,
  getblogByUrl
} = require('./blogController');
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
router.post('/create-blog', upload.fields([
  { name: 'bannerImage', maxCount: 1 },
  { name: 'images', maxCount: 10 } // Changed from 'contentImages' to 'images'
]), async (req, res) => {
  try {
    const result = await createblog(req);
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
router.get('/blogs', async (req, res) => {
  try {
    const result = await getAllblogs();
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

router.get('/trending-blogs/:url', async (req, res) => {
  try {
    const result = await gettrendingblogs(req.params.url);
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

router.get('/trending-blogs-data', async (req, res) => {
  try {
    const result = await gettrendingdatablogs();
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
router.get('/blog/:url', async (req, res) => {
  try {
    const result = await getblogByUrl(req.params.url);
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

router.get('/blogs/:id', async (req, res) => {
  try {
    const result = await getblogById(req.params.id);
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

router.put('/blog/:id', upload.fields([
  { name: 'bannerImage', maxCount: 1 },  
  { name: 'images', maxCount: 10 }      
]), async (req, res) => {
  try {
    const result = await updateblog(req.params.id, req);
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
router.delete('/blog/:id', async (req, res) => {
  try {
    const result = await deleteblog(req.params.id);
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