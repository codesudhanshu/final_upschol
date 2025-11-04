const express = require('express');
const router = express.Router();
const { 
  createBanner,
  getAllBanners,
  getBannerById,
  updateBanner,
  deleteBanner
} = require('./bannerController');
const { verifyAdminToken } = require('../../../utils/tokenAuthenticator');
const serviceResponse = require('../../../utils/serviceResponse');
const constant = require('../../../constant');
const multer = require('multer');
const storage = multer.memoryStorage(); // or diskStorage
const upload = multer({ storage });
module.exports = upload;

// Create Banner
router.post('/create-banner', upload.single('image'), async (req, res) => {
  try {
    const result = await createBanner(req);
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

// Get all Banners
router.get('/banners', async (req, res) => {
  try {
    const result = await getAllBanners();
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

// Get single Banner
router.get('/banner/:id', async (req, res) => {
  try {
    const result = await getBannerById(req.params.id);
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

// Update Banner
router.put('/banner/:id', upload.single('image'), async (req, res) => {
  try {
    const result = await updateBanner(req.params.id, req);
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

// Delete Banner
router.delete('/banner/:id', async (req, res) => {
  try {
    const result = await deleteBanner(req.params.id);
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