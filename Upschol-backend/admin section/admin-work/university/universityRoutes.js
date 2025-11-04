const express = require('express');
const router = express.Router();
const { 
  getAllUniversities,
  getUniversityById,
  updateUniversity,
  deleteUniversity,
  createUniversity,
  getAllpartners,
  getAllpartnersdata,
  getUniversityBycollegeUrl,
  getMultipleUniversitiesData
} = require('./universityController');
const { verifyAdminToken } = require('../../../utils/tokenAuthenticator');
const serviceResponse = require('../../../utils/serviceResponse');
const constant = require('../../../constant');
const multer = require('multer');

// Configure Multer for multiple file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Create University (Admin only)
router.post('/create-university', 
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'universityHomeImage', maxCount: 1 },
    { name: 'sampleCertificate', maxCount: 1 }
  ]), 
  async (req, res) => {
    try {
      const result = await createUniversity(req);
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
  }
);

// Get All Universities (Public)
router.get('/universities', async (req, res) => {
  try {
    const result = await getAllUniversities();
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


router.get('/partner-university', async (req, res) => {
  try {
    const result = await getAllpartnersdata();
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

// Get Single University (Public)
router.get('/university/:id', async (req, res) => {
  try {
    const result = await getUniversityById(req.params.id);
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

// Update University (Admin only)
router.put('/university/:id', 
  verifyAdminToken,
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'universityHomeImage', maxCount: 1 },
    { name: 'sampleCertificate', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const result = await updateUniversity(req.params.id, req);
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
  }
);

// Delete University (Admin only)
router.delete('/university/:id', async (req, res) => {
  try {
    const result = await deleteUniversity(req.params.id);
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



router.get('/university-data/:collegeUrl', async (req, res) => {
  try {
    const result = await getUniversityBycollegeUrl(req.params.collegeUrl);
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



router.get('/university-data-compare/:collegeUrl', async (req, res) => {
  try {
    const result = await getMultipleUniversitiesData(req.params.collegeUrl);
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
  app.use('/admin', router); // This adds /admin prefix to all routes in the router
};