const express = require('express');
const router = express.Router();
const { 
  createannouncement,
  getAllannouncements,
  getannouncement,
  updateannouncement,
  deleteannouncement,
  getfooter
} = require('./announcementController');
const { verifyAdminToken } = require('../../../utils/tokenAuthenticator');
const serviceResponse = require('../../../utils/serviceResponse');
const constant = require('../../../constant');

// Create announcement
router.post('/create-announcement', async (req, res) => {
  try {
    const result = await createannouncement(req);
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
router.get('/announcement', async (req, res) => {
  try {
    const result = await getAllannouncements();
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
router.put('/announcement/:id', verifyAdminToken, async (req, res) => {
  try {
    const result = await updateannouncement(req.params.id, req.body);
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
router.delete('/announcement/:id', verifyAdminToken, async (req, res) => {
  try {
    const result = await deleteannouncement(req.params.id);
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
router.get('/getfooter', async (req, res) => {
  try {
    const result = await getfooter();
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